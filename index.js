const async = require('async');
const _ = require("lodash");
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
        // Lean or Non-Lean Assets to decide which fields to use 
        var originalFields = [];
        if (options.apos.assets.options.lean) {
            originalFields = [
                {
                    name: "ajaxOptions",
                    label: "Ajax Options",
                    type: "string",
                    textarea: true,
                    htmlHelp: `Example :
            <br><br><pre><code style="font-family: monospace;background-color: #EEE;padding: 10px;font: 300 12px monospace;display: block;">ajax: {
    url: "some/url/data.txt", // url to remote data
    content: {
        type: "csv", // specify the content
    },
    load: function(xhr) {
        // process and return the response data
    }
}</code></pre>You can refer here for more info : <a href="https://github.com/fiduswriter/Simple-DataTables/wiki/ajax" target="_blank">DataTables Vanilla JS Ajax Data Source</a><br>`
                }
            ];
        } else {
            originalFields = [
                {
                    name: "ajaxOptions",
                    label: "Ajax Options",
                    type: "string",
                    textarea: true,
                    htmlHelp: `Example :
            <br><br><pre><code style="font-family: monospace;background-color: #EEE;padding: 10px;font: 300 12px monospace;display: block;">{
  ajax: "data/arrays.txt"
}</code></pre>You can refer here for more info : <a href="https://datatables.net/examples/ajax/" target="_blank">DataTables JQuery Ajax Data Source</a><br>`
                }
            ]
        }
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
                type : "slug"
            }
        ].concat(options.addFields || []);

        // Combine fields
        options.addFields = options.addFields.concat(originalFields);

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
                fields: ["title", "row", "column", "data"]
            },
            {
                name: "ajax",
                label: "Ajax Table",
                fields: ["ajaxOptions"]
            },
            {
                name: "settings",
                label: "Settings",
                fields: ["id", "slug", "published", "tags", "trash" , "url"],
                last: true
            }
        ].concat(options.arrangeFields || []);
    },
    afterConstruct : function(self){
        self.dynamicTableSchemas();
        self.allBrowserCalls();
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;

        self.pushAssets = function(){
            superPushAssets();

            self.pushAsset('script' , "myEditor", {
                when : "user"
            })

            self.pushAsset('script', 'utils', {
                when: "user"
            });
        }

        self.allBrowserCalls = function () {
            var options = {}
            _.defaults(options, {
                name: "dynamic-table-utils",
                browser: {}
            })

            _.extend(options.browser, {
                action: "/modules/dynamic-table",
                schemas: self.tableSchemas,
                group: self.tableSchemasGroup
            })

            // To push apos.modules["dynamic-table-utils"] && also other options to pass on
            self.apos.push.browserCall("user", "apos.createModule(? , ? , ?)", "dynamic-table-utils", {
                editorDataTableOptions: {
                    "scrollY": 200,
                    "scrollX": true,
                    "retrieve": true
                }
            }, "dynamicTableUtils")

            // Push extra options
            self.apos.push.browserCall("user", "apos.create(? , ?)", "dynamic-table-utils", options.browser)
        }

        self.dynamicTableSchemas = function(){
            self.tableSchemas = self.apos.schemas.subset(self.schema, 
                ["title", "row", "column" , "data", "ajaxOptions" , "id" , "url"])
            self.tableSchemasGroup = self.apos.schemas.toGroups(self.schema);
        };

        self.route("post", "update-fields", function(req, res){
            return self.routes.updateFields(req, function(err){
                if(err){
                    return res.send({
                        status : "error",
                        message : err
                    })
                }

                return res.send({
                    status : "success",
                    message : "Piece updated !"
                })
            })
        })

        self.route("get", "get-fields", function(req, res){
            return self.routes.getFields(req, function(err ,result){
                if(err){
                    return res.send({
                        status : "error",
                        message : err
                    })
                }

                return res.send({
                    status : "success",
                    message : result
                })
            })
        })

        self.routes.updateFields = function(req, callback){
            var allowFilterSchemas = self.tableSchemas.reduce((init, next, i) => Object.assign(init, init[next.name] = 1), {})

            var criteria = {
                _id: req.body.id
            };

            return self.find(req, criteria, Object.assign(allowFilterSchemas , { url : 1 })).toObject(function (err, result) {
                if (err) {
                    return callback(err);
                }

                var newPiece = _.cloneDeep(result);

                newPiece.id = req.body.id;
                newPiece.url = req.body.url;

                return self.update(req, newPiece, {permissions : false} , callback);
            })
        }

        self.routes.getFields = function(req, callback){
            var allowFilterSchemas = self.tableSchemas.reduce((init, next, i) => Object.assign(init, init[next.name] = 1), {})

            var criteria = { _id: req.query.id };

            return self.find(req, criteria , allowFilterSchemas).toObject(function(err , result){
                if(err){
                    return callback(err);
                }
                return callback(null ,result)
            })
        }

        self.apos.permissions.add({
            value: 'edit-dynamic-table',
            label: 'Edit Dynamic Table'
        });
    }
}