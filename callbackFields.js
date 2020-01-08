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
    name: 'advance',
    label: 'Advance Tabulator',
    fields: ['callbacks', 'tableCallback', 'columnCallback', 'ajaxCallback']
}

module.exports = {
    addFields: [{
        type: 'checkboxes',
        name: 'callbacks',
        label: 'Tabulator Callbacks',
        help: 'To enable callbacks, you can check one or more for your own callback',
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
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#table" target="_blank">http://tabulator.info/docs/4.0/callbacks#column</a>`,
        ace: aceDefault
    },
    {
        name: 'ajaxCallback',
        label: 'Ajax Callbacks',
        type: 'custom-code-editor',
        htmlHelp: `Docs : <a href="http://tabulator.info/docs/4.0/callbacks#table" target="_blank">http://tabulator.info/docs/4.0/callbacks#ajax</a>`,
        ace: aceDefault
    }],
    arrangeFields: myArrangeFields
}