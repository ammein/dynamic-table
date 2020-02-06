let aceDefault = {
    defaultMode: 'javascript',
    config: {
        dropdown: null,
        optionsCustomizer: {
            enable: false
        }
    }
}

let addFields = [{
            type: 'checkboxes',
            name: 'callbacks',
            label: 'Tabulator Callbacks',
            htmlHelp: 'To enable callbacks, you can check one or more checkboxes of each callback types and you can start customize your callbacks below.<br>Docs : <a href="http://tabulator.info/docs/4.0/callbacks" target="_blank">http://tabulator.info/docs/4.0/callbacks</a>',
            choices: [{
                    label: 'Table Callback',
                    value: 'table',
                    showFields: ['tableCallback']
                },
                {
                    label: 'Column Callback',
                    value: 'column',
                    showFields: ['columnCallback']
                },
                {
                    label: 'Ajax Callback',
                    value: 'ajax',
                    showFields: ['ajaxCallback']
                },
                {
                    label: 'Row Callback',
                    value: 'row',
                    showFields: ['rowCallback']
                },
                {
                    label: 'Cell Callback',
                    value: 'cell',
                    showFields: ['cellCallback']
                },
                {
                    label: 'Data Callback',
                    value: 'data',
                    showFields: ['dataCallback']
                },
                {
                    label: 'Filter Callback',
                    value: 'filter',
                    showFields: ['filterCallback']
                },
                {
                    label: 'Sorting Callback',
                    value: 'sorting',
                    showFields: ['sortingCallback']
                },
                {
                    label: 'Layout Callback',
                    value: 'layout',
                    showFields: ['layoutCallback']
                },
                {
                    label: 'Pagination Callback',
                    value: 'pagination',
                    showFields: ['paginationCallback']
                },
                {
                    label: 'Selection Callback',
                    value: 'selection',
                    showFields: ['selectionCallback']
                },
                {
                    label: 'Row Movement Callback',
                    value: 'rowMovement',
                    showFields: ['rowMovementCallback']
                },
                {
                    label: 'Validation Callback',
                    value: 'validation',
                    showFields: ['validationCallback']
                },
                {
                    label: 'History Callback',
                    value: 'history',
                    showFields: ['historyCallback']
                },
                {
                    label: 'Clipboard Callback',
                    value: 'clipboard',
                    showFields: ['clipboardCallback']
                },
                {
                    label: 'Download Callback',
                    value: 'download',
                    showFields: ['downloadCallback']
                },
                {
                    label: 'Data Tree Callback',
                    value: 'dataTree',
                    showFields: ['dataTreeCallback']
                },
                {
                    label: 'Scrolling Callback',
                    value: 'scrolling',
                    showFields: ['scrollingCallback']
                }
            ]
        },
        {
            name: 'tableCallback',
            label: 'Table Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#table" target="_blank">http://tabulator.info/docs/4.0/callbacks#table</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'columnCallback',
            label: 'Column Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#column" target="_blank">http://tabulator.info/docs/4.0/callbacks#column</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'ajaxCallback',
            label: 'Ajax Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#ajax" target="_blank">http://tabulator.info/docs/4.0/callbacks#ajax</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'rowCallback',
            label: 'Row Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#row" target="_blank">http://tabulator.info/docs/4.5/callbacks#row</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'cellCallback',
            label: 'Cell Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#cell" target="_blank">http://tabulator.info/docs/4.5/callbacks#cell</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'dataCallback',
            label: 'Data Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#data" target="_blank">http://tabulator.info/docs/4.5/callbacks#data</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'filterCallback',
            label: 'Filter Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#filter" target="_blank">http://tabulator.info/docs/4.5/callbacks#filter</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'sortingCallback',
            label: 'Sorting Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#sort" target="_blank">http://tabulator.info/docs/4.5/callbacks#sort</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'layoutCallback',
            label: 'Layout Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#layout" target="_blank">http://tabulator.info/docs/4.5/callbacks#layout</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'paginationCallback',
            label: 'Pagination Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#page" target="_blank">http://tabulator.info/docs/4.5/callbacks#page</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'selectionCallback',
            label: 'Selection Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#select" target="_blank">http://tabulator.info/docs/4.5/callbacks#select</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'rowMovementCallback',
            label: 'Row Movement Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#row-move" target="_blank">http://tabulator.info/docs/4.5/callbacks#row-move</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'validationCallback',
            label: 'Validation Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#validation" target="_blank">http://tabulator.info/docs/4.5/callbacks#validation</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'historyCallback',
            label: 'History Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#history" target="_blank">http://tabulator.info/docs/4.5/callbacks#history</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'clipboardCallback',
            label: 'Clipboard Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#clipboard" target="_blank">http://tabulator.info/docs/4.5/callbacks#clipboard</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'downloadCallback',
            label: 'Download Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#download" target="_blank">http://tabulator.info/docs/4.5/callbacks#download</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'dataTreeCallback',
            label: 'Data Tree Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#tree" target="_blank">http://tabulator.info/docs/4.5/callbacks#tree</a>`,
            ace: aceDefault,
            browserSchema: true
        },
        {
            name: 'scrollingCallback',
            label: 'Scrolling Callbacks',
            type: 'custom-code-editor',
            htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#scrolling target="_blank">http://tabulator.info/docs/4.5/callbacks#scrolling</a>`,
            ace: aceDefault,
            browserSchema: true
        }
    ];

let myArrangeFields = {
    name: 'callbacks',
    label: 'Tabulator Callbacks',
    fields: addFields.map(val => val.name)
}

module.exports = {
    addFields: addFields,
    arrangeFields: myArrangeFields,
    aceDefault: aceDefault
}