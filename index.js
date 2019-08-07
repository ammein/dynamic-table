module.exports = {
    extend : "apostrophe-pieces",
    name : "dynamic-table",
    label : "Dynamic Table",
    alias : "dynamicTable",
    moogBundle : {
        modules: ['dynamic-table-schemas', 'dynamic-table-widgets'],
        directory: 'lib/modules'
    },
    addFields : [
        {
            name: '_dynamicTable',
            label: 'Dynamic Table Display',
            type: 'joinByOne',
            withType: 'dynamic-table-widgets'
        }
    ]
}