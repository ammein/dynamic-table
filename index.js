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
                fields: ["title", "row", "column", "data" , "adjustRow" , "adjustColumn"]
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

            self.pushAsset("script", "vendor/papaparse/papaparse.min",{
                when : "user"
            })

            self.pushAsset("script", 'vendor/json5/json5', {
                when: "always"
            })
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

        self.route("get", "get-query", function(req,res){
            return self.routes.getQuery(req, function(err,result){
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

        self.route("post", "remove-urls" , function(req,res){
            return self.routes.removeUrls(req ,function(err){
                if(err){
                    return res.send({
                        status : "error",
                        message : err
                    })
                }

                return res.send({
                    status : "success",
                    message : "Successfully remove widget location"
                })
            })
        })

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

        self.routes.getQuery = function(req,callback){

            if (!req.query.id) {
                return callback("Id not found")
            }

            var allowFilterSchemas = self.tableSchemas.reduce((init, next, i) => Object.assign(init, init[next.name] = 1), {})
            var criteria = {
                _id : req.query.id
            };

            // Always find one
            return self.find(req, criteria, allowFilterSchemas).toObject(function(err,result){
                if(err){
                    return callback(err);
                }

                if(result){
                    return callback(null, result);
                }

                return callback("Unable to find table. Are you sure it saves correctly ?");
            })
        }

        self.routes.removeUrls = function(req,callback){

            if (!req.body.id) {
                return callback("Id not found")
            }

            var criteria = {
                _id: req.body.id
            };

            return self.find(req, criteria).toObject(function(err, result){
                if(err){
                    return callback(url);
                }

                var newPiece = _.cloneDeep(result);
                newPiece.id = req.body.id;
                if(Array.isArray(req.body.url)){
                    var filter = result.url.reduce((init, next , i) => init.concat({ id : next.id , widgetLocation : req.body.url.filter((val,i)=> next.widgetLocation === val )[0]}) , []).filter((val,i) => val.widgetLocation);
                }else{
                    var filter = result.url.filter((val, i) => val && val.widgetLocation !== req.body.url);
                }
                newPiece.url = filter;
                newPiece.published = true;

                return self.update(req, newPiece, { permissions : false }, callback);
            })
        }

        self.routes.updateFields = function(req, callback){

            if(!req.body.id){
                return callback("Id not found")
            }

            var criteria = {
                _id: req.body.id
            };

            return self.find(req, criteria).toObject(function (err, result) {
                if (err) {
                    return callback(err);
                }

                var newPiece = _.cloneDeep(result);
                newPiece.id = req.body.id;
                var filter = result.url.filter((val , i) => val && val.widgetLocation === req.body.url);
                newPiece.url = filter && filter.length > 0 ? newPiece.url : _.uniq(_.union(newPiece.url, [{
                    id : self.apos.utils.generateId(),
                    widgetLocation : req.body.url
                }]), "url")
                newPiece.published = true;

                return self.update(req, newPiece, {permissions : false} , callback);
            })
        }

        self.routes.getFields = function(req, callback){

            if (!req.query.id) {
                return callback("Id not found")
            }

            var allowFilterSchemas = self.tableSchemas.reduce((init, next, i) => Object.assign(init, init[next.name] = 1), {})

            var criteria = { _id: req.query.id };

            return self.find(req, criteria , allowFilterSchemas).toObject(function(err , result){
                if(err){
                    return callback(err);
                }

                if(result){
                    return callback(null, result)
                }

                return callback("Table Not Matched");
            })
        }

        self.apos.permissions.add({
            value: 'edit-dynamic-table',
            label: 'Edit Dynamic Table'
        });
    }
}