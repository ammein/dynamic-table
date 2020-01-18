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
        directory: 'lib/modules'
    },
    beforeConstruct : function(self,options){
        options.addFields = [
            {
                name : "title",
                type : "string",
                label : "Table Title",
                required : true
            },
            {
                name: 'row',
                label: 'Number of Row(s)',
                type: 'integer'
            },
            {
                name: 'column',
                label: 'Number of Column(s)',
                type: 'integer'
            },
            {
                name: "data",
                label: "Custom Data",
                type: "string",
                textarea: true,
                help: "This field is auto generated by your row & column input."
            },
            {
                name : "id",
                label : "ID",
                type : "string",
                help : "ID for the table",
                required : true,
                readOnly : true
            },
            {
                name : "url",
                label : "Link",
                type : "array",
                titleField : "urls",
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
                type: "string"
            }
        ].concat(options.addFields || []);

        if (options.apos.customCodeEditor) {
            options.addFields = options.addFields.concat(require('./callbackFields.js').addFields || []);
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
                label: "Custom Table",
                fields: ["title", "row", "column", "data" , "adjustRow" , "adjustColumn"]
            },
            {
                name: "ajax",
                label: "Ajax Table",
                fields: ["ajaxURL"]
            },
            {
                name: "settings",
                label: "Settings",
                fields: ["id", "slug", "published", "tags", "trash" , "url"],
                last: true
            }
        ].concat(options.arrangeFields || []);

        options.arrangeFields = options.arrangeFields.concat(require("./callbackFields.js").arrangeFields || []);

        // Path submodules
        options.pathSubModules = path.join(__dirname, '/sub_modules');
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