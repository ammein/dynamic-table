/* global JSONfn, ace */
apos.define('custom-code-editor', {
    construct: function(self, options) {
        // create superPopulate to extend method
        let superPopulate = self.populate;

        let superConvert = self.convert;

        // Get extension self object
        let _this = self;

        // Clean up data and reject if unacceptable
        self.convert = function (data, name, $field, $el, field, callback) {
            return superConvert(data, name, $field, $el, field, function() {

                if (self.tabulator && self.tabulator.originalCache[name]) {
                    let returnObj = {}

                    let dataObj = JSONfn.parse(self.tabulator.convertJSONFunction(data[name].code))
                    let originalObj = self.tabulator.originalCache[name].reduce((init, next, i) => Object.assign({}, init, next), {});
                    let cacheObj = self.tabulator.cache[name].reduce((init, next, i) => Object.assign({}, init, next), {});

                    for (let key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            let oriKey = Object.getOwnPropertyNames(originalObj).filter((val, i) => val === key)[0]
                            if (key === oriKey) {
                                // Match String function
                                if (cacheObj[key].toString() !== originalObj[key].toString()) {
                                    returnObj[key] = cacheObj[key]
                                }
                            }
                        }
                    }

                    // Set into object serverside
                    if (Object.getOwnPropertyNames(returnObj).length > 0) {
                        data[name].code = JSONfn.stringify(returnObj);
                    } else {
                        delete data[name]
                    }
                }

                return setImmediate(callback);
            });
        }

        self.populate = function (object, name, $field, $el, field, callback) {
            superPopulate(object, name, $field, $el, field, callback);

            // Locate the element on specific schema
            let $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            let $fieldInput = $fieldSet.find('[data-editor]').get(0);

            // Init Editor
            // eslint-disable-next-line no-undef
            let editor = ace.edit($fieldInput);

            self.tabulator = {
                callbacks: {},
                cache: {},
                originalCache: {}
            };

            self.tabulator.events = function(editorType) {

                let onChange = debounce(function (delta) {
                    // delta.start, delta.end, delta.lines, delta.action
                    let value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

                    try {
                        value = self.tabulator.convertJSONFunction(value);

                        // Check only that is change
                        value = self.tabulator.cacheCheck(editorType, JSONfn.parse(value));

                        // Restart Table
                        self.tabulator.restartTableCallback(value);

                    } catch (e) {
                        if (value !== '{}') {
                            apos.notify('' + editorType + ' : ' + e.message + '.', {
                                type: 'error',
                                dismiss: 3
                            });
                        }
                    }
                }, 2000)

                // Will off the event listener for not triggering this type of events too many times when switching tabs (Bugs)
                self[editorType].editor.session.off('change', onChange);

                // Add new event listener on change
                self[editorType].editor.session.on('change', onChange);
            }

            self.tabulator.restartTableCallback = function(callbackObj) {
                // eslint-disable-next-line no-undef
                apos.dynamicTableUtils.tabulator.options = Object.assign({}, apos.dynamicTableUtils.tabulator.options, callbackObj)

                // Restart Table
                apos.dynamicTableUtils.restartTable();
            }

            // Thanks to the article https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
            const debounce = (func, delay) => {
                let inDebounce
                return function () {
                    const context = this
                    const args = arguments
                    clearTimeout(inDebounce)
                    inDebounce = setTimeout(() => func.apply(context, args), delay)
                }
            }

            // Using JSONfn (https://github.com/vkiryukhin/jsonfn) to make function enable on JSON Object
            /**
             * To convert string inputs to JSONFn format so that able to use JSONfn.parse(value) later
             */
            self.tabulator.convertJSONFunction = function(value) {
                value = self.tabulator.JSONFunctionStringify(value);
                value = self.tabulator.addNewLineInFunction(value);
                value = self.tabulator.removeBreakLines(value);

                return value;
            }

            /**
             * To convert object to string for for friendly inputs adjustment on custom-code-editor
             */
            self.tabulator.convertToString = function(value) {
                value = JSONfn.stringify(value);
                value = self.tabulator.JSONFunctionParse(value);
                value = self.tabulator.JSONFuncToNormalString(value);
                return value;
            }

            // Remove break lines and replace with '\n' string for JSONfn.parse() to use
            self.tabulator.removeBreakLines = function(text) {
                try {
                    text = text.replace(/\s+(?!\S)/g, '');
                } catch (e) {
                    apos.utils.warn('Unable to remove break line for: \n', text)
                }
                return text;
            }

            // Restructurize string into friendly & familiar string. Good case for Objects Javascript for Custom-Code-Editor display
            self.tabulator.JSONFuncToNormalString = function(text) {
                try {
                    text = text.replace(/(\\n|\\r)+/g, '\n');
                    text = text.replace(/\\"/g, '"');
                    text = text.replace(/"(\{(.|[\r\n])+\})"/g, '$1');
                } catch (e) {
                    apos.utils.warn('Unable to convert to string for: \n', text)
                }

                return text
            }

            // Remove all string quotes from function and keys to make it normal string object display on custom-code-editor
            self.tabulator.JSONFunctionParse = function(text) {
                try {
                    text = text.replace(/(?:"(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})")|"(\w+?)"(?=(\s*?):\s*(?!function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}))/g, '$1$3');
                } catch (e) {
                    apos.utils.warn('Unable to JSONfn parse format for: \n', text)
                }
                return text;
            }

            // Anything that has break lines replace it with '\n'. Also make the strings of all of them in single line of string. Easy for JSONfn.parse()
            self.tabulator.addNewLineInFunction = function(text) {

                try {
                    // Store Match String
                    let textArr = text.match(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g);

                    // Replace with empty string
                    text = text.replace(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g, '');

                    textArr = textArr.map(function (val, i, arr) {
                        val = val.replace(/"/g, '\\"')
                        return val.replace(/(\r\n|\n|\r)/g, '\\n');
                    });
                    let i = -1;
                    text = text.replace(/""/g, function (val) {
                        i++;
                        return '"' + textArr[i] + '"';
                    });
                } catch (e) {
                    apos.utils.warn('Unable to add new line in function for: \n', text)
                }

                return text;
            }

            // Convert everything from string that has Object Javascript format with double quotes string. Later to be use on JSON.parse()
            self.tabulator.JSONFunctionStringify = function(text) {
                return text.replace(/(\w+?)(?=(\s*:+?))|(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})|(\w+?)(?=(\s*?):\s*function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})/g, '"$&"');
            }

            // To check and compare with cache. If changes detected, replace the value. Also return with new object on changes
            self.tabulator.cacheCheck = function(editorType, valueObj) {
                let returnObj = {}
                // Return Adjusted Changes Only
                self.tabulator.cache[editorType].forEach(function(val, i, arr) {
                    for (let key in valueObj) {
                        if (valueObj.hasOwnProperty(key)) {
                            if (Object.getOwnPropertyNames(val)[0] === key &&
                                val[key].toString() !== valueObj[key].toString()) {
                                returnObj[key] = valueObj[key];
                            }
                        }
                    }
                });

                // Adjust Cache
                for (let key in valueObj) {
                    if (valueObj.hasOwnProperty(key)) {
                        self.tabulator.cache[editorType] = self.tabulator.cache[editorType].map(function (val, i, arr) {
                            if (key === Object.getOwnPropertyNames(val)[0]) {
                                return {
                                    [key]: valueObj[key]
                                };
                            } else {
                                return val;
                            }
                        })
                    }
                }

                return returnObj;
            }

            // Store all editor cache
            self.tabulator.editorCache = function(editorType, string) {
                self.tabulator.cache[editorType] = []
                self.tabulator.originalCache[editorType] = []

                let JSONFuncObj = JSONfn.parse(self.tabulator.convertJSONFunction(string));

                for (let key in JSONFuncObj) {
                    if (JSONFuncObj.hasOwnProperty(key)) {
                        self.tabulator.cache[editorType] = self.tabulator.cache[editorType].concat({
                            [key]: JSONFuncObj[key]
                        })
                        self.tabulator.originalCache[editorType] = self.tabulator.originalCache[editorType].concat({
                            [key]: JSONFuncObj[key]
                        })
                    }
                }
            }

            // This is where it all started
            self.tabulator.setValue = function($form, type, reset) {
                let beautify = ace.require('ace/ext/beautify');
                let existsObject = {}
                type.forEach(function(val, i, arr) {
                    let strings = apos.dynamicTableUtils.tabulator.callbackStrings(val);

                    // Set Worker to be false to disable error highlighting
                    self[val].editor.session.setUseWorker(false);

                    // Store to cache for comparison check
                    self.tabulator.editorCache(val, strings);

                    if (object[val] && Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).length > 0 && !reset) {
                        let obj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                        // Restart Table
                        existsObject = Object.assign({}, existsObject, JSONfn.parse(object[val].code))

                        // Change on cache if its match
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                let objectKey = Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).filter((val, i) => val === key)[0];
                                let objectFunc = JSONfn.parse(object[val].code)[key]
                                if (objectKey === key) {
                                    self.tabulator.cache[val] = self.tabulator.cache[val].map(function(cacheObj, i, arr) {
                                        if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                                            return { [key]: objectFunc }
                                        } else {
                                            return cacheObj
                                        }
                                    })
                                    self.tabulator.originalCache[val] = self.tabulator.originalCache[val].map(function (cacheObj, i, arr) {
                                        if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                                            return {
                                                [key]: objectFunc
                                            }
                                        } else {
                                            return cacheObj
                                        }
                                    })

                                    // Parse the objects of functions and convert to string
                                    let editorStringObj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                                    for (let editorKey in editorStringObj) {
                                        if (editorStringObj.hasOwnProperty(editorKey)) {
                                            if (editorKey === key) {
                                                editorStringObj[editorKey] = objectFunc
                                            }
                                        }
                                    }

                                    // Apply to editor string value
                                    self[val].editor.session.setValue(self.tabulator.convertToString(editorStringObj))

                                    // Beautify it back
                                    beautify.beautify(self[val].editor.session);
                                }
                            }
                        }
                    } else {
                        // Set Value to Editor after checking the exists object
                        self[val].editor.session.setValue(strings);

                        // Beautify the Javascript Object in Editor
                        beautify.beautify(self[val].editor.session);
                    }

                    // Apply on change events (Must trigger last!)
                    self.tabulator.events(val);
                    // End Set Value
                })
                // End loop
                if (Object.getOwnPropertyNames(existsObject).length > 0) {
                    self.tabulator.restartTableCallback(existsObject)
                }
            }

            // End Custom Code Editor Extends
        }
    }
})