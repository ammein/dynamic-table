const _ = require("lodash");
const fs = require('fs');
const path = require('path');
module.exports = {
    extend : "apostrophe-pieces",
    name : "dynamic-tables",
    label : "Dynamic Table",
    pluralLabel : "Dynamic Tables",
    alias : "dynamicTable",
    seo: false,
    openGraph: false,
    searchable : false,
    moogBundle : {
        modules: ['dynamic-table-schemas', 'dynamic-table-widgets'],
        directory: 'collections/modules'
    },
    beforeConstruct : function(self,options){
        options.addFields = [
            {
                name : "title",
                type : "string",
                label : "Table Title",
                required : true,
                browserSchema : true
            },
            {
                name: 'row',
                label: 'Number of Row(s)',
                type: 'integer',
                browserSchema: true
            },
            {
                name: 'column',
                label: 'Number of Column(s)',
                type: 'integer',
                browserSchema: true
            },
            {
                name: "data",
                label: "Custom Data",
                type: "string",
                textarea: true,
                help: "This field is auto generated by your row & column input.",
                browserSchema: true
            },
            {
                name : "id",
                label : "ID",
                type : "string",
                help : "ID for the table",
                required : true,
                readOnly : true,
                browserSchema: true
            },
            {
                name : "url",
                label : "Link",
                type : "array",
                titleField : "urls",
                browserSchema: true,
                schema : [
                    {
                        name : "widgetLocation",
                        type : "slug",
                        label : "Widget Location On Page",
                        page : true
                    }
                ]
            },
            {
                name : "adjustRow",
                label : "Adjust Your Row Content Here",
                type : "array",
                titleField : "adjustRows",
                schema : [
                    {
                        name : "rowContent",
                        type : "string",
                        label : "Row Content",
                        htmlHelp: `To escape delimiter, you should wrap your content with double qoute string on delimiter : <br><br><code style="font-family: monospace;background-color: #EEE;padding: 5px;font: 300 12px monospace;">First"," column row, another column row</code><br><br> To escape double quote string, simply use backslash character : <br><br><code style="font-family: monospace;background-color: #EEE;padding: 10px;font: 300 12px monospace;display:block;">Escape double quote string : \\"<br>Escape using backslash to use the backslash string : \\\\</code>`
                    }
                ]
            },
            {
                name : "adjustColumn",
                label : "Adjust Your Column Content Here",
                type : "array",
                titleField: "adjustColumns",
                schema : [
                    {
                        name : "columnContent",
                        type : "string",
                        label : "Column Content"
                    }
                ]
            },
            {
                name: "ajaxURL",
                label: "Ajax URL",
                type: "string",
                browserSchema: true
            }
        ].concat(options.addFields || []);

        if (options.apos.customCodeEditor) {
            options.addFields = options.addFields.concat(require('./callbackFields.js').addFields || []).concat([{
                type: 'custom-code-editor',
                name: 'tabulatorOptions',
                help: 'Feel free to add your own options for your own Tabulator table. Make sure you use this quote string \" to wrap a string value',
                ace: require('./callbackFields.js').aceDefault,
                browserSchema: true
            }] || [])
        }

        options.addColumns = [
            {
                name : "url",
                label : "Widget Location",
                partial: function (value) {
                    if (!value) {
                        return '';
                    }
                    return self.partial('widgetLink.html', {
                        value: value
                    });
                }
            }
        ].concat(options.addColumns || []);

        options.arrangeFields = [
            {
                name: "table",
                label: "Tabulator Data",
                fields: ["title", "row", "column", "data" , "adjustRow" , "adjustColumn"]
            },
            {
                name: "ajax",
                label: "Tabulator Ajax",
                fields: ["ajaxURL"]
            },
            {
                name: "settings",
                label: "Settings",
                fields: ["id", "slug", "published", "tags", "trash" , "url"],
                last: true
            }
        ].concat(options.arrangeFields || []);

        options.arrangeFields = options.arrangeFields.concat(require("./callbackFields.js").arrangeFields || []).concat([{
            name: 'options',
            label: 'Tabulator Options',
            fields: ['tabulatorOptions']
        }] || [])

        // Path submodules
        options.pathSubModules = path.join(__dirname, '/sub-modules');

        options.tabulatorOptions = options.tabulatorOptions || {
            layout: 'fitColumns',
            autoColumns: true,
            responsiveLayout: true,
            paginationSize: 6,
            pagination: "local"
        };
    },
    afterConstruct : function(self){
        self.dynamicTableSchemas();
        self.allBrowserCalls();
    },
    construct : function(self,options){
        var superBeforeList = self.beforeList;
        self.pathSubModules = options.pathSubModules;

        fs.readdirSync(self.pathSubModules).filter((file)=>{
            require(path.join(self.pathSubModules,file))(self, options);
        })

        self.apos.permissions.add({
            value: 'edit-dynamic-table',
            label: 'Edit Dynamic Table'
        });
        
    }
}