module.exports = {
    extend: "apostrophe-pieces",
    name: "test-piece",
    label: "Test Piece",
    pluralLabel: "Test Pieces",
    alias: "testPiece",
    seo: false,
    openGraph: false,
    searchable: false,
    beforeConstruct: function(self,options) {
        options.addFields = [{
                type: 'checkboxes',
                name: 'callbacks',
                label: 'Tabulator Callbacks',
                htmlHelp: 'To enable callbacks, you can check one or more checkboxes of each callback types and you can start customize your callbacks below.<br>Docs : <a href="http://tabulator.info/docs/4.0/callbacks" target="_blank">http://tabulator.info/docs/4.0/callbacks</a>',
                choices: [{
                    label: 'Table Callback',
                    value: 'table',
                    showFields: ['tableCallback']
                }, {
                    label: 'Column Callback',
                    value: 'column',
                    showFields: ['columnCallback']
                }, {
                    label: 'Ajax Callback',
                    value: 'ajax',
                    showFields: ['ajaxCallback']
                }, {
                    label: 'Row Callback',
                    value: 'row',
                    showFields: ['rowCallback']
                }, {
                    label: 'Cell Callback',
                    value: 'cell',
                    showFields: ['cellCallback']
                }, {
                    label: 'Data Callback',
                    value: 'data',
                    showFields: ['dataCallback']
                }, {
                    label: 'Filter Callback',
                    value: 'filter',
                    showFields: ['filterCallback']
                }, {
                    label: 'Sorting Callback',
                    value: 'sorting',
                    showFields: ['sortingCallback']
                }, {
                    label: 'Layout Callback',
                    value: 'layout',
                    showFields: ['layoutCallback']
                }, {
                    label: 'Pagination Callback',
                    value: 'pagination',
                    showFields: ['paginationCallback']
                }, {
                    label: 'Selection Callback',
                    value: 'selection',
                    showFields: ['selectionCallback']
                }, {
                    label: 'Row Movement Callback',
                    value: 'rowMovement',
                    showFields: ['rowMovementCallback']
                }, {
                    label: 'Validation Callback',
                    value: 'validation',
                    showFields: ['validationCallback']
                }, {
                    label: 'History Callback',
                    value: 'history',
                    showFields: ['historyCallback']
                }, {
                    label: 'Clipboard Callback',
                    value: 'clipboard',
                    showFields: ['clipboardCallback']
                }, {
                    label: 'Download Callback',
                    value: 'download',
                    showFields: ['downloadCallback']
                }, {
                    label: 'Data Tree Callback',
                    value: 'dataTree',
                    showFields: ['dataTreeCallback']
                }, {
                    label: 'Scrolling Callback',
                    value: 'scrolling',
                    showFields: ['scrollingCallback']
                }]
            },
            {
                name: 'tableCallback',
                label: 'Table Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#table" target="_blank">http://tabulator.info/docs/4.0/callbacks#table</a>`
            },
            {
                name: 'columnCallback',
                label: 'Column Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#column" target="_blank">http://tabulator.info/docs/4.0/callbacks#column</a>`
            }, {
                name: 'ajaxCallback',
                label: 'Ajax Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#ajax" target="_blank">http://tabulator.info/docs/4.0/callbacks#ajax</a>`
            }, {
                name: 'rowCallback',
                label: 'Row Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#row" target="_blank">http://tabulator.info/docs/4.5/callbacks#row</a>`
            }, {
                name: 'cellCallback',
                label: 'Cell Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#cell" target="_blank">http://tabulator.info/docs/4.5/callbacks#cell</a>`
            }, {
                name: 'dataCallback',
                label: 'Data Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#data" target="_blank">http://tabulator.info/docs/4.5/callbacks#data</a>`
            }, {
                name: 'filterCallback',
                label: 'Filter Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#filter" target="_blank">http://tabulator.info/docs/4.5/callbacks#filter</a>`
            }, {
                name: 'sortingCallback',
                label: 'Sorting Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#sort" target="_blank">http://tabulator.info/docs/4.5/callbacks#sort</a>`
            }, {
                name: 'layoutCallback',
                label: 'Layout Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#layout" target="_blank">http://tabulator.info/docs/4.5/callbacks#layout</a>`
            }, {
                name: 'paginationCallback',
                label: 'Pagination Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#page" target="_blank">http://tabulator.info/docs/4.5/callbacks#page</a>`
            }, {
                name: 'selectionCallback',
                label: 'Selection Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#select" target="_blank">http://tabulator.info/docs/4.5/callbacks#select</a>`
            }, {
                name: 'rowMovementCallback',
                label: 'Row Movement Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#row-move" target="_blank">http://tabulator.info/docs/4.5/callbacks#row-move</a>`
            }, {
                name: 'validationCallback',
                label: 'Validation Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#validation" target="_blank">http://tabulator.info/docs/4.5/callbacks#validation</a>`
            }, {
                name: 'historyCallback',
                label: 'History Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#history" target="_blank">http://tabulator.info/docs/4.5/callbacks#history</a>`
            }, {
                name: 'clipboardCallback',
                label: 'Clipboard Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#clipboard" target="_blank">http://tabulator.info/docs/4.5/callbacks#clipboard</a>`
            }, {
                name: 'downloadCallback',
                label: 'Download Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#download" target="_blank">http://tabulator.info/docs/4.5/callbacks#download</a>`
            }, {
                name: 'dataTreeCallback',
                label: 'Data Tree Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#tree" target="_blank">http://tabulator.info/docs/4.5/callbacks#tree</a>`
            }, {
                name: 'scrollingCallback',
                label: 'Scrolling Callbacks',
                type: 'custom-code-editor',
                htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#scrolling target="_blank">http://tabulator.info/docs/4.5/callbacks#scrolling</a>`
            }
        ].concat(options.addFields || []);
    }
}