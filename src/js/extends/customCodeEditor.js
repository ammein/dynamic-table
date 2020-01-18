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

                    // eslint-disable-next-line no-undef
                    let dataObj = JSONfn.parse(self.tabulator.convertJSONFunction(data[name].code))
                    // eslint-disable-next-line no-undef
                    let originalObj = self.tabulator.originalCache[name].reduce((init, next, i) => Object.assign({}, init, next), {});
                    // eslint-disable-next-line no-undef
                    let cacheObj = self.tabulator.cache[name].reduce((init, next, i) => Object.assign({}, init, next), {});

                    for (let key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            let oriKey = Object.getOwnPropertyNames(originalObj).filter((val, i) => val === key)[0]
                            if (key === oriKey) {
                                // Match String function
                                if (dataObj[key].toString() !== originalObj[key].toString()) {
                                    returnObj[key] = cacheObj[key]
                                }
                            }
                        }
                    }

                    // Set into object serverside
                    if (Object.getOwnPropertyNames(returnObj).length > 0) {
                        // eslint-disable-next-line no-undef
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
                        // eslint-disable-next-line no-undef
                        value = self.tabulator.cacheCheck(editorType, JSONfn.parse(value));

                        // Restart Table
                        self.tabulator.restartTableCallback(value);

                    } catch (e) {
                        apos.notify(`Oops! Your code is not working! Check the error on console.`, {
                            type: 'error',
                            dismiss: true
                        })
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
                // eslint-disable-next-line no-undef
                value = JSONfn.stringify(value);
                value = self.tabulator.JSONFunctionParse(value);
                value = self.tabulator.JSONFuncToNormalString(value);
                return value;
            }

            // Remove break lines and replace with '\n' string for JSONfn.parse() to use
            self.tabulator.removeBreakLines = function(text) {
                return text.replace(/\s+(?!\S)/g, '');
            }

            // Restructurize string into friendly & familiar string. Good case for Objects Javascript for Custom-Code-Editor display
            self.tabulator.JSONFuncToNormalString = function(text) {
                text = text.replace(/\\n/g, '\n');
                text = text.replace(/\\"/g, '"');
                return text.replace(/"(\{(.|[\r\n])+\})"/g, '$1');
            }

            // Remove all string quotes from function and keys to make it normal string object display on custom-code-editor
            self.tabulator.JSONFunctionParse = function(text) {
                return text.replace(/(?:"(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})")|"(\w+?)"(?=(\s*?):\s*(?!function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}))/g, '$1$3');
            }

            // Anything that has break lines replace it with '\n'. Also make the strings of all of them in single line of string. Easy for JSONfn.parse()
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

                // eslint-disable-next-line no-undef
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

            // All Editor Callbacks strings to use and to edit
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
                                dataLoading: function(data) {
                                    //data - the data loading into the table
                                },
                                dataLoaded: function(data) {
                                    //data - all data loaded into the table
                                },
                                dataEdited: function(data) {
                                    //data - the updated table data
                                },
                                htmlImporting: function() {},
                                htmlImported: function() {}
                            }`;
                        break;

                    case 'filterCallback':
                        string = `{
                                dataFiltering:function(filters){
                                    //filters - array of filters currently applied
                                },
                                dataFiltered:function(filters, rows){
                                    //filters - array of filters currently applied
                                    //rows - array of row components that pass the filters
                                }
                            }`;
                        break;

                    case 'sortingCallback':
                        string = `{
                                dataSorting: function (sorters) {
                                    //sorters - an array of the sorters currently applied
                                },
                                dataSorted: function (sorters, rows) {
                                    //sorters - array of the sorters currently applied
                                    //rows - array of row components in their new order
                                }
                            }`;
                        break;

                    case 'layoutCallback':
                        string = `{
                                renderStarted: function () {},
                                renderComplete: function () {}
                            }`;
                        break;

                    case 'paginationCallback':
                        string = `{
                                pageLoaded: function (pageno) {
                                    //pageno - the number of the loaded page
                                }
                            }`;
                        break;

                    case 'selectionCallback':
                        string = `{
                                rowSelected: function (row) {
                                    //row - row component for the selected row
                                },
                                rowDeselected: function (row) {
                                    //row - row component for the deselected row
                                },
                                rowSelectionChanged: function (data, rows) {
                                    //rows - array of row components for the selected rows in order of selection
                                    //data - array of data objects for the selected rows in order of selection
                                }
                            }`;
                        break;

                    case 'rowMovementCallback':
                        string = `{
                                movableRowsSendingStart: function (toTables) {
                                    //toTables - array of receiving table elements
                                },
                                movableRowsSent: function (fromRow, toRow, toTable) {
                                    //fromRow - the row component from the sending table
                                    //toRow - the row component from the receiving table (if available)
                                    //toTable - the Tabulator object for the receiving table
                                },
                                movableRowsSentFailed: function (fromRow, toRow, toTable) {
                                    //fromRow - the row component from the sending table
                                    //toRow - the row component from the receiving table (if available)
                                    //toTable - the Tabulator object for the receiving table
                                },
                                movableRowsSendingStop: function (toTables) {
                                    //toTables - array of receiving table Tabulator objects
                                },
                                movableRowsReceivingStart: function (fromRow, fromTable) {
                                    //fromRow - the row component from the sending table
                                    //fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceived: function (fromRow, toRow, fromTable) {
                                    //fromRow - the row component from the sending table
                                    //toRow - the row component from the receiving table (if available)
                                    //fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceivedFailed: function (fromRow, toRow, fromTable) {
                                    //fromRow - the row component from the sending table
                                    //toRow - the row component from the receiving table (if available)
                                    //fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceivingStop: function (fromTable) {
                                    //fromTable - the Tabulator object for the sending table
                                }
                            }`;
                        break;

                    case 'validationCallback':
                        string = `{
                                validationFailed: function (cell, value, validators) {
                                    //cell - cell component for the edited cell
                                    //value - the value that failed validation
                                    //validatiors - an array of validator objects that failed
                                }
                            }`;
                        break;

                    case 'historyCallback':
                        string = `{
                                historyUndo: function (action, component, data) {
                                    //action - the action that has been undone
                                    //component - the Component object afected by the action (colud be a row or cell component)
                                    //data - the data being changed
                                },
                                historyRedo: function (action, component, data) {
                                    //action - the action that has been redone
                                    //component - the Component object afected by the action (colud be a row or cell component)
                                    //data - the data being changed
                                }
                            }`;
                        break;

                    case 'clipboardCallback':
                        string = `{
                                clipboardCopied: function (clipboard) {
                                    //clipboard - the string that has been copied into the clipboard
                                },
                                clipboardPasted: function (clipboard, rowData, rows) {
                                    //clipboard - the clipboard string
                                    //rowData - the row data from the paste parser
                                    //rows - the row components from the paste action (this will be empty if the "replace" action is used)
                                },
                                clipboardPasteError: function (clipboard) {
                                    //clipboard - the clipboard string that was rejected by the paste parser
                                }
                            }`;
                        break;

                    case 'downloadCallback':
                        string = `{
                                downloadDataFormatter: function (data) {
                                    //data - active table data array

                                    data.forEach(function (row) {
                                        row.age = row.age >= 18 ? "adult" : "child";
                                    });

                                    return data;
                                },
                                downloadReady: function (fileContents, blob) {
                                    //fileContents - the unencoded contents of the file
                                    //blob - the blob object for the download

                                    //custom action to send blob to server could be included here

                                    return blob; //must return a blob to proceed with the download, return false to abort download
                                },
                                downloadComplete: function () {}
                            }`;
                        break;

                    case 'dataTreeCallback':
                        string = `{
                                dataTreeRowExpanded: function (row, level) {
                                    //row - the row component for the expanded row
                                    //level - the depth of the row in the tree
                                },
                                dataTreeRowCollapsed: function (row, level) {
                                    //row - the row component for the collapsed row
                                    //level - the depth of the row in the tree
                                }
                            }`;
                        break;

                    case 'scrollingCallback':
                        string = `{
                                scrollVertical: function (top) {
                                    //top - the current vertical scroll position
                                },
                                scrollHorizontal: function (left) {
                                    //left - the current horizontal scroll position
                                }
                            }`;
                        break;

                    default:
                        string = `{}`
                        break;
                }

                return string;
            }

            // This is where it all started
            self.tabulator.setValue = function($form, type, reset) {
                // eslint-disable-next-line no-undef
                let beautify = ace.require('ace/ext/beautify');
                let existsObject = {}
                type.forEach(function(val, i, arr) {
                    let strings = self.tabulator.callbackStrings(val);

                    // Set Worker to be false to disable error highlighting
                    self[val].editor.session.setUseWorker(false);

                    // Store to cache for comparison check
                    self.tabulator.editorCache(val, strings);

                    // eslint-disable-next-line no-undef
                    if (object[val] && Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).length > 0 && !reset) {
                        // eslint-disable-next-line no-undef
                        let obj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                        // Restart Table
                        // eslint-disable-next-line no-undef
                        existsObject = Object.assign({}, existsObject, JSONfn.parse(object[val].code))

                        // Change on cache if its match
                        for (let key in obj) {
                            // eslint-disable-next-line no-undef
                            if (obj.hasOwnProperty(key)) {
                                // eslint-disable-next-line no-undef
                                let objectKey = Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).filter((val, i) => val === key)[0];
                                // eslint-disable-next-line no-undef
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

                                    // Change on string later (TODO)
                                    // eslint-disable-next-line no-undef
                                    let editorStringObj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                                    for (let editorKey in editorStringObj) {
                                        if (editorStringObj.hasOwnProperty(editorKey)) {
                                            if (editorKey === key) {
                                                editorStringObj[editorKey] = objectFunc
                                            }
                                        }
                                    }

                                    // eslint-disable-next-line no-undef
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