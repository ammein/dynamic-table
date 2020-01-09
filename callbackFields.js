let aceDefault = {
    defaultMode: 'javascript',
    config: {
        dropdown: null,
        optionsCustomizer: {
            enable: false
        }
    }
}

let myArrangeFields = {
    name: 'callbacks',
    label: 'Tabulator Callbacks',
    fields: ['callbacks', 'tableCallback', 'columnCallback', 'ajaxCallback', 'rowCallback', 'cellCallback', 'dataCallback']
}

module.exports = {
    addFields: [
    {
        type: 'checkboxes',
        name: 'callbacks',
        label: 'Tabulator Callbacks',
        htmlHelp: 'To enable callbacks, you can check one or more checkboxes of each callback types and you can start customize your callbacks below.<br>Docs : <a href="http://tabulator.info/docs/4.0/callbacks" target="_blank">http://tabulator.info/docs/4.0/callbacks</a>',
        choices: [
            {
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
            }
        ]
    },
    {
        name: 'tableCallback',
        label: 'Table Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#table" target="_blank">http://tabulator.info/docs/4.0/callbacks#table</a>`,
        ace: aceDefault
    },
    {
        name: 'columnCallback',
        label: 'Column Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#column" target="_blank">http://tabulator.info/docs/4.0/callbacks#column</a>`,
        ace: aceDefault
    },
    {
        name: 'ajaxCallback',
        label: 'Ajax Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#ajax" target="_blank">http://tabulator.info/docs/4.0/callbacks#ajax</a>`,
        ace: aceDefault
    },
    {
        name: 'rowCallback',
        label: 'Row Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#row" target="_blank">http://tabulator.info/docs/4.5/callbacks#row</a>`,
        ace: aceDefault
    },
    {
        name: 'cellCallback',
        label: 'Cell Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#cell" target="_blank">http://tabulator.info/docs/4.5/callbacks#cell</a>`,
        ace: aceDefault
    },
    {
        name: 'dataCallback',
        label: 'Data Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.5/callbacks#data" target="_blank">http://tabulator.info/docs/4.5/callbacks#data</a>`,
        ace: aceDefault
    }
    ],
    arrangeFields: myArrangeFields
}