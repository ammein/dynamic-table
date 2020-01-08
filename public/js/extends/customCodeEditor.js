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
                callbacks: {}
            };

            self.tabulator.events = function(editorType) {
                self[editorType].editor.session.on('change', debounce(function(delta) {
                    // delta.start, delta.end, delta.lines, delta.action
                    let value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

                    value = self.tabulator.convertJSONFunction(value);

                    // eslint-disable-next-line no-undef
                    apos.dynamicTableUtils.tabulator.options = Object.assign({}, apos.dynamicTableUtils.tabulator.options, JSONfn.parse(value))

                    // Restart Table
                    if (apos.dynamicTableUtils.tabulator.options.ajaxURL) {
                        // If Ajax enabled, just reload the table
                        apos.dynamicTableUtils.tabulator.table.setData();
                    } else {
                        // Restart normal custom table
                        apos.dynamicTableUtils.initTable();
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
                            self[val].editor.session.setValue(`{
                                tableBuilding: function () {},
                                tableBuilt: function () {}
                            }`);
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val)
                            break;

                        case 'columnCallback':
                            // Set Worker to be false to disable error highlighting
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(`{
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
                            }`);
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);
                            break;
                        case 'ajaxCallback':
                            self[val].editor.session.setUseWorker(false);
                            self[val].editor.session.setValue(`{
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
                            }`);
                            beautify.beautify(self[val].editor.session);
                            self.tabulator.events(val);
                            break;
                    }
                })
            }
        }
    }
})