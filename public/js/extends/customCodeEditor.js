apos.define('custom-code-editor', {
    construct: function(self, options) {
        // create superPopulate to extend method
        let superPopulate = self.populate;

        // Get extension self object
        let _this = self;

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
                cache: {}
            };

            self.tabulator.events = function(editorType) {
                self[editorType].editor.session.on('change', debounce(function(delta) {
                    // delta.start, delta.end, delta.lines, delta.action
                    let value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

                    try {
                        value = self.tabulator.convertJSONFunction(value);

                        // Check only that is change
                        // eslint-disable-next-line no-undef
                        value = self.tabulator.cacheCheck(editorType, JSONfn.parse(value));

                        // eslint-disable-next-line no-undef
                        apos.dynamicTableUtils.tabulator.options = Object.assign({}, apos.dynamicTableUtils.tabulator.options, value)

                        // Restart Table
                        if (apos.dynamicTableUtils.tabulator.options.ajaxURL) {
                            // If Ajax enabled, just reload the table
                            apos.dynamicTableUtils.executeAjax();
                        } else {
                            // Restart normal custom table
                            apos.dynamicTableUtils.initTable();
                        }
                    } catch (e) {
                        apos.notify(`Oops! Your code is not working! Check the error on console.`, {
                            type: 'error',
                            dismiss: true
                        })

                        console.error(e)
                    }
                }, 2000))
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
            self.tabulator.convertJSONFunction = function(value) {
                value = self.tabulator.keyStringify(value);
                value = self.tabulator.functionStringify(value);
                value = self.tabulator.addNewLineInFunction(value);
                value = self.tabulator.removeBreakLines(value);

                return value;
            }

            self.tabulator.removeBreakLines = function(text) {
                return text.replace(/\s+(?!\S)/g, '');
            }

            self.tabulator.addNewLineInFunction = function(text) {
                // Store Match String
                let textArr = text.match(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g);

                // Replace with empty string
                text = text.replace(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g, '');

                textArr = textArr.map(function (val, i, arr) {
                    val = val.replace(/"/g, '\\"')
                    return val.replace(/(\r\n|\n|\r)/g, '\\n');
                });
                let i = -1;
                text = text.replace(/""/g, function(val) {
                    i++;
                    return '"' + textArr[i] + '"';
                });

                return text;
            }

            self.tabulator.keyStringify = function(text) {
                return text.replace(/(\w+?)(?=(\s*?):\s*function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})/g, '"$&"');
            }

            self.tabulator.functionStringify = function(text) {
                return text.replace(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g, '"$&"');
            }

            self.tabulator.cacheCheck = function(editorType, valueObj) {
                return self.tabulator.cache[editorType].filter(function(val, i, arr) {
                    for (let key in valueObj) {
                        if (valueObj.hasOwnProperty(key)) {
                            if (Object.getOwnPropertyNames(val)[0] === key) {
                                return val[key].toString() !== valueObj[key].toString()
                            }
                        }
                    }
                }).reduce(function(init, next, i) {
                    return {
                        ...init,
                        [Object.getOwnPropertyNames(next)[0]]: next[Object.getOwnPropertyNames(next)[0]]
                    }
                }, {});
            }

            self.tabulator.editorCache = function(editorType, string) {
                self.tabulator.cache[editorType] = []

                // eslint-disable-next-line no-undef
                let JSONFuncObj = JSONfn.parse(self.tabulator.convertJSONFunction(string));

                for (let key in JSONFuncObj) {
                    if (JSONFuncObj.hasOwnProperty(key)) {
                        self.tabulator.cache[editorType] = self.tabulator.cache[editorType].concat({
                            [key]: JSONFuncObj[key]
                        })
                    }
                }
            }

            self.tabulator.callbackStrings = function(editorType) {
                let string = ``;
                switch (editorType) {
                    case 'tableCallback':
                        string = `{
                                    tableBuilding: function () {},
                                    tableBuilt: function () {}
                                }`
                        break;

                    case 'columnCallback':
                        string = `{
                                columnMoved: function (column, columns) {
                                    //column - column component of the moved column
                                    //columns- array of columns in new order
                                }, 
                                columnResized: function (column) {
                                    //column - column component of the resized column
                                },
                                columnVisibilityChanged: function (column, visible) {
                                    //column - column component
                                    //visible - is column visible (true = visible, false = hidden)
                                },
                                columnTitleChanged: function (column) {
                                    //column - column component
                                }
                            }`

                        break;

                    case 'ajaxCallback':
                        string = `{
                                ajaxRequesting: function (url, params) {
                                    //url - the URL of the request
                                    //params - the parameters passed with the request
                                },
                                ajaxResponse: function (url, params, response) {
                                    // console.log('Table Ajax Response', response);
                                    return response;
                                },
                                ajaxError: function (xhr, textStatus, errorThrown) {
                                    //xhr - the XHR object
                                    //textStatus - error type
                                    //errorThrown - text portion of the HTTP status
                                }
                            }`
                        break;

                    case 'rowCallback':
                        string = `{
                                rowClick: function (e, row) {
                                    //e - the click event object
                                    //row - row component
                                },
                                rowDblClick: function (e, row) {
                                    //e - the click event object
                                    //row - row component
                                },
                                rowContext: function (e, row) {
                                    //e - the click event object
                                    //row - row component

                                    e.preventDefault(); // prevent the browsers default context menu form appearing.
                                },
                                rowTap: function (e, row) {
                                    //e - the tap event object
                                    //row - row component
                                },
                                rowDblTap: function (e, row) {
                                    //e - the tap event object
                                    //row - row component
                                },
                                rowTapHold: function (e, row) {
                                    //e - the tap event object
                                    //row - row component
                                },
                                rowMouseEnter: function (e, row) {
                                    //e - the event object
                                    //row - row component
                                },
                                rowMouseLeave: function (e, row) {
                                    //e - the event object
                                    //row - row component
                                },
                                rowMouseOver: function (e, row) {
                                    //e - the event object
                                    //row - row component
                                },
                                rowMouseOut: function (e, row) {
                                    //e - the event object
                                    //row - row component
                                },
                                rowMouseMove: function (e, row) {
                                    //e - the event object
                                    //row - row component
                                },
                                rowAdded: function (row) {
                                    //row - row component
                                },
                                rowUpdated: function (row) {
                                    //row - row component
                                },
                                rowDeleted: function (row) {
                                    //row - row component
                                },
                                rowMoved: function (row) {
                                    //row - row component
                                },
                                rowResized: function (row) {
                                    //row - row component of the resized row
                                }
                            }`
                        break;

                    case 'cellCallback':
                        string = `{
                                cellClick: function (e, cell) {
                                    //e - the click event object
                                    //cell - cell component
                                },
                                cellDblClick: function (e, cell) {
                                    //e - the click event object
                                    //cell - cell component
                                },
                                cellContext: function (e, cell) {
                                    //e - the click event object
                                    //cell - cell component
                                },
                                cellTap: function (e, cell) {
                                    //e - the tap event object
                                    //cell - cell component
                                },
                                cellDblTap: function (e, cell) {
                                    //e - the tap event object
                                    //cell - cell component
                                },
                                cellTapHold: function (e, cell) {
                                    //e - the tap event object
                                    //cell - cell component
                                },
                                cellMouseEnter: function (e, cell) {
                                    //e - the event object
                                    //cell - cell component
                                },
                                cellMouseLeave: function (e, cell) {
                                    //e - the event object
                                    //cell - cell component
                                },
                                cellMouseOver: function (e, cell) {
                                    //e - the event object
                                    //cell - cell component
                                },
                                cellMouseOut: function (e, cell) {
                                    //e - the event object
                                    //cell - cell component
                                },
                                cellMouseMove: function (e, cell) {
                                    //e - the event object
                                    //cell - cell component
                                },
                                cellEditing: function (cell) {
                                    //cell - cell component
                                },
                                cellEditCancelled: function (cell) {
                                    //cell - cell component
                                },
                                cellEdited: function (cell) {
                                    //cell - cell component
                                }
                            }`
                        break;

                    case 'dataCallback':
                        string = `{
                                dataLoading: function (data) {
                                    //data - the data loading into the table
                                },
                                dataLoaded: function (data) {
                                    //data - all data loaded into the table
                                }
                            }`;
                        break;

                    default:
                        string = `{}`
                        break;
                }

                return string;
            }

            /**
             * Rules of set value object
             * Do not put extra space before colon ':'
             */
            self.tabulator.setValue = function($form, type) {
                // eslint-disable-next-line no-undef
                let beautify = ace.require('ace/ext/beautify');
                type.forEach(function(val, i, arr) {
                    switch (val) {
                        case 'tableCallback':
                            // Set Worker to be false to disable error highlighting
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val)

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;

                        case 'columnCallback':
                            // Set Worker to be false to disable error highlighting
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;
                        case 'ajaxCallback':
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;
                        case 'rowCallback':
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;
                        case 'cellCallback':
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;
                        case 'dataCallback':
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(self.tabulator.callbackStrings(val));
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);

                            // Store to cache for comparison check
                            self.tabulator.editorCache(val, self.tabulator.callbackStrings(val));
                            break;
                    }
                })
            }
        }
    }
})