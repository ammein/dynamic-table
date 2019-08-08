const _ = require("lodash");
module.exports = {
    extend : "apostrophe-widgets",
    label : "Table Widget",
    scene : "user",
    afterConstruct : function(self){
        // Allow devs to extend it
        self.pushAssets();
        self.allBrowserCalls();
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;
        self.table = self.apos.dynamicTable;

        options.addFields = self.table.tableSchemas;
        // Automatically filter on this particular apostrophe-widgets arrangeFields
        options.arrangeFields = self.table.options.arrangeFields.reduce(function (init, next, i, arr) {
            var merge;
            for (var a = 0; a < self.table.tableSchemasGroup.length; a++) {
                if (self.table.tableSchemasGroup[a].name === next.name) {
                    merge = next;
                }
            }
            return init.concat(merge)
        }, []).filter((val, i) => val)

        // Override but pass extra data (data.something)
        self.output = function (widget, options) {
            return self.partial(self.template, {
                widget: widget,
                options: options,
                manager: self,
                // Pass to widget.html
                table: self.myData
            });
        };

        self.allBrowserCalls = function(){
            var options = {}
            _.defaults(options, {
                name : "dynamic-table-utils",
                browser: {}
            })

            _.extend(options.browser, {
                action: "/modules/dynamic-table",
                schemas : self.table.tableSchemas,
                group : self.table.tableSchemasGroup
            })

            // To push apos.modules["dynamic-table-utils"]
            self.apos.push.browserCall("user", "apos.createModule(? , ? , ?)", "dynamic-table-utils", {
                EditorDataTableOptions: {
                    "scrollY": 200,
                    "scrollX": true,
                    "retrieve": true
                }
            }, "dynamicTableUtils")

            // Push extra options
            self.apos.push.browserCall("user" , "apos.create(? , ?)" , "dynamic-table-utils", options.browser)
        }

        self.route("post", "submit", function(req,res){
            if(!req.body.table){
                return res.send({
                    status : "error",
                    message : "Data Not Received"
                })
            }

            // Get data
            self.myData = req.body.table

            return res.send({
                status : "success",
                message : "Data Received"
            })
        })

        self.pushAssets = function(){
            self.pushAsset('script', 'editor', {
                when : "user"
            });

            self.pushAsset("script", 'vendor/json5/json5', {
                when : "always"
            })

            self.pushAsset('script', 'utils', {
                when: "user"
            });

            if(self.apos.assets.options.lean){
                if(options.player){
                    self.pushAsset('script', 'vendor/datatablesVanillaJS/datatables.min', {
                        when: "lean"
                    });

                    self.pushAsset('script', 'lean', {
                        when: "lean"
                    });

                    self.pushAsset('stylesheet', 'vendor/datatablesVanillaJS/datatables.min', {
                        when: "lean"
                    })
                }
            }else{
                self.pushAsset('script', 'vendor/datatablesJQuery/datatables.min', {
                    when: "always"
                });

                self.pushAsset('stylesheet', 'vendor/datatablesJQuery/datatables.min', {
                    when: "always"
                });
            }

            superPushAssets();
        }

        // Extend Options to get on browser apostrophe-widgets JS
        var superGetCreateSingletonOptions = self.getCreateSingletonOptions;
        self.getCreateSingletonOptions = function (req) {
            var options = superGetCreateSingletonOptions(req);
            // On widgets editor, we could have "options.module.options.table". Don't ever use self.table cause the JSON 
            // converter is exhausted somehow. Perhaps, a function would help easily
            options.table = "Testing";
            return options;
        };
    }
}