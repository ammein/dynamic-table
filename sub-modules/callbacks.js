const JSONfn = require('jsonfn').JSONfn
const beautify = require('js-beautify').js
const beautifyOptions = {
    'indent_size': '4',
    'indent_char': ' ',
    'max_preserve_newlines': '5',
    'preserve_newlines': true,
    'keep_array_indentation': false,
    'break_chained_methods': false,
    'indent_scripts': 'normal',
    'brace_style': 'collapse',
    'space_before_conditional': true,
    'unescape_strings': false,
    'jslint_happy': true,
    'end_with_newline': false,
    'wrap_line_length': '0',
    'indent_inner_html': false,
    'comma_first': false,
    'e4x': false,
    'indent_empty_lines': false
}
module.exports = function(self, options) {
    self.callbacks = {
        tableCallback: {
                            tableBuilding: function () {},
                            tableBuilt: function () {}
                        },
        columnCallback: {
                            columnMoved: function (column, columns) {
                                // column - column component of the moved column
                                // columns- array of columns in new order
                            },
                            columnResized: function (column) {
                                // column - column component of the resized column
                            },
                            columnVisibilityChanged: function (column, visible) {
                                // column - column component
                                // visible - is column visible (true = visible, false = hidden)
                            },
                            columnTitleChanged: function (column) {
                                // column - column component
                            }
                        },
        ajaxCallback: {
                            ajaxRequesting: function (url, params) {
                                // url - the URL of the request
                                // params - the parameters passed with the request
                            },
                            ajaxResponse: function (url, params, response) {
                                // Uncomment code below to use
                                /* --------------------------------- */
                                // console.log('Table Ajax Response', response);
                                // return response;
                            },
                            ajaxError: function (xhr, textStatus, errorThrown) {
                                // xhr - the XHR object
                                // textStatus - error type
                                // errorThrown - text portion of the HTTP status
                            }
                        },
        rowCallback: {
                        rowClick: function (e, row) {
                            // e - the click event object
                            // row - row component
                        },
                        rowDblClick: function (e, row) {
                            // e - the click event object
                            // row - row component
                        },
                        rowContext: function (e, row) {
                            // e - the click event object
                            // row - row component

                            // Uncomment code below to use
                            /* --------------------------------- */
                            // e.preventDefault(); // prevent the browsers default context menu form appearing.
                        },
                        rowTap: function (e, row) {
                            // e - the tap event object
                            // row - row component
                        },
                        rowDblTap: function (e, row) {
                            // e - the tap event object
                            // row - row component
                        },
                        rowTapHold: function (e, row) {
                            // e - the tap event object
                            // row - row component
                        },
                        rowMouseEnter: function (e, row) {
                            // e - the event object
                            // row - row component
                        },
                        rowMouseLeave: function (e, row) {
                            // e - the event object
                            // row - row component
                        },
                        rowMouseOver: function (e, row) {
                            // e - the event object
                            // row - row component
                        },
                        rowMouseOut: function (e, row) {
                            // e - the event object
                            // row - row component
                        },
                        rowMouseMove: function (e, row) {
                            // e - the event object
                            // row - row component
                        },
                        rowAdded: function (row) {
                            // row - row component
                        },
                        rowUpdated: function (row) {
                            // row - row component
                        },
                        rowDeleted: function (row) {
                            // row - row component
                        },
                        rowMoved: function (row) {
                            // row - row component
                        },
                        rowResized: function (row) {
                            // row - row component of the resized row
                        }
                    },
        cellCallback: {
                        cellClick: function (e, cell) {
                            // e - the click event object
                            // cell - cell component
                        },
                        cellDblClick: function (e, cell) {
                            // e - the click event object
                            // cell - cell component
                        },
                        cellContext: function (e, cell) {
                            // e - the click event object
                            // cell - cell component
                        },
                        cellTap: function (e, cell) {
                            // e - the tap event object
                            // cell - cell component
                        },
                        cellDblTap: function (e, cell) {
                            // e - the tap event object
                            // cell - cell component
                        },
                        cellTapHold: function (e, cell) {
                            // e - the tap event object
                            // cell - cell component
                        },
                        cellMouseEnter: function (e, cell) {
                            // e - the event object
                            // cell - cell component
                        },
                        cellMouseLeave: function (e, cell) {
                            // e - the event object
                            // cell - cell component
                        },
                        cellMouseOver: function (e, cell) {
                            // e - the event object
                            // cell - cell component
                        },
                        cellMouseOut: function (e, cell) {
                            // e - the event object
                            // cell - cell component
                        },
                        cellMouseMove: function (e, cell) {
                            // e - the event object
                            // cell - cell component
                        },
                        cellEditing: function (cell) {
                            // cell - cell component
                        },
                        cellEditCancelled: function (cell) {
                            // cell - cell component
                        },
                        cellEdited: function (cell) {
                            // cell - cell component
                        }
                    },
        dataCallback: {
                        dataLoading: function(data) {
                            // data - the data loading into the table
                        },
                        dataLoaded: function(data) {
                            // data - all data loaded into the table
                        },
                        dataEdited: function(data) {
                            // data - the updated table data
                        },
                        htmlImporting: function() {},
                        htmlImported: function() {}
                    },
        filterCallback: {
                            dataFiltering: function(filters) {
                                // filters - array of filters currently applied
                            },
                            dataFiltered: function(filters, rows) {
                                // filters - array of filters currently applied
                                // rows - array of row components that pass the filters
                            }
                        },
        sortingCallback: {
                            dataSorting: function (sorters) {
                                // sorters - an array of the sorters currently applied
                            },
                            dataSorted: function (sorters, rows) {
                                // sorters - array of the sorters currently applied
                                // rows - array of row components in their new order
                            }
                        },
        layoutCallback: {
                            renderStarted: function () {},
                            renderComplete: function () {}
                        },
        paginationCallback: {
                                pageLoaded: function (pageno) {
                                    // pageno - the number of the loaded page
                                }
                            },
        selectionCallback: {
                                rowSelected: function (row) {
                                    // row - row component for the selected row
                                },
                                rowDeselected: function (row) {
                                    // row - row component for the deselected row
                                },
                                rowSelectionChanged: function (data, rows) {
                                    // rows - array of row components for the selected rows in order of selection
                                    // data - array of data objects for the selected rows in order of selection
                                }
                            },
        rowMovementCallback: {
                                movableRowsSendingStart: function (toTables) {
                                    // toTables - array of receiving table elements
                                },
                                movableRowsSent: function (fromRow, toRow, toTable) {
                                    // fromRow - the row component from the sending table
                                    // toRow - the row component from the receiving table (if available)
                                    // toTable - the Tabulator object for the receiving table
                                },
                                movableRowsSentFailed: function (fromRow, toRow, toTable) {
                                    // fromRow - the row component from the sending table
                                    // toRow - the row component from the receiving table (if available)
                                    // toTable - the Tabulator object for the receiving table
                                },
                                movableRowsSendingStop: function (toTables) {
                                    // toTables - array of receiving table Tabulator objects
                                },
                                movableRowsReceivingStart: function (fromRow, fromTable) {
                                    // fromRow - the row component from the sending table
                                    // fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceived: function (fromRow, toRow, fromTable) {
                                    // fromRow - the row component from the sending table
                                    // toRow - the row component from the receiving table (if available)
                                    // fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceivedFailed: function (fromRow, toRow, fromTable) {
                                    // fromRow - the row component from the sending table
                                    // toRow - the row component from the receiving table (if available)
                                    // fromTable - the Tabulator object for the sending table
                                },
                                movableRowsReceivingStop: function (fromTable) {
                                    // fromTable - the Tabulator object for the sending table
                                }
                            },
        validationCallback: {
                                validationFailed: function (cell, value, validators) {
                                    // cell - cell component for the edited cell
                                    // value - the value that failed validation
                                    // validatiors - an array of validator objects that failed
                                }
                            },
        historyCallback: {
                                historyUndo: function (action, component, data) {
                                    // action - the action that has been undone
                                    // component - the Component object afected by the action (colud be a row or cell component)
                                    // data - the data being changed
                                },
                                historyRedo: function (action, component, data) {
                                    // action - the action that has been redone
                                    // component - the Component object afected by the action (colud be a row or cell component)
                                    // data - the data being changed
                                }
                            },
        clipboardCallback: {
                                clipboardCopied: function (clipboard) {
                                    // clipboard - the string that has been copied into the clipboard
                                },
                                clipboardPasted: function (clipboard, rowData, rows) {
                                    // clipboard - the clipboard string
                                    // rowData - the row data from the paste parser
                                    // rows - the row components from the paste action (this will be empty if the "replace" action is used)
                                },
                                clipboardPasteError: function (clipboard) {
                                    // clipboard - the clipboard string that was rejected by the paste parser
                                }
                            },
        downloadCallback: {
                                downloadDataFormatter: function (data) {
                                    // data - active table data array

                                    // Uncomment code below to use
                                    /* --------------------------------- */
                                    // data.forEach(function (row) {
                                    //     row.age = row.age >= 18 ? 'adult' : 'child';
                                    // });

                                    // return data;
                                },
                                downloadReady: function (fileContents, blob) {
                                    // fileContents - the unencoded contents of the file
                                    // blob - the blob object for the download

                                    // custom action to send blob to server could be included here

                                    // must return a blob to proceed with the download, return false to abort download

                                    // Uncomment code below to use
                                    /* --------------------------------- */
                                    // return blob;
                                },
                                downloadComplete: function () {}
                            },
        dataTreeCallback: {
                                dataTreeRowExpanded: function (row, level) {
                                    // row - the row component for the expanded row
                                    // level - the depth of the row in the tree
                                },
                                dataTreeRowCollapsed: function (row, level) {
                                    // row - the row component for the collapsed row
                                    // level - the depth of the row in the tree
                                }
                            },
        scrollingCallback: {
                                scrollVertical: function (top) {
                                    // top - the current vertical scroll position
                                },
                                scrollHorizontal: function (left) {
                                    // left - the current horizontal scroll position
                                }
                            }
    }

    if (options.callbacks) {
        for (let key in options.callbacks) {
            if (options.callbacks.hasOwnProperty(key)) {
                self.callbacks[key] = options.callbacks[key]
            }
        }
    }

    // Beautify it on server and send it to string
    for (let key in self.callbacks) {
        if (self.callbacks.hasOwnProperty(key)) {
            self.callbacks[key] = JSONfn.parse(beautify(JSONfn.stringify(self.callbacks[key]), beautifyOptions))
        }
    }

    self.callbacks = JSONfn.stringify(self.callbacks)
}