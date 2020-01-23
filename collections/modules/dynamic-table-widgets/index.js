const async = require('async');
const callbackFields = require('../../../callbackFields.js').arrangeFields;
module.exports = {
    extend : "apostrophe-widgets",
    label : "Table Widget",
    alias: 'table' ,
    scene : "user",
    beforeConstruct : function(self,options){
        let fields = callbackFields.fields.filter(function(val, i) {
            return val !== 'callbacks'
        }).reduce((init, next, i) => Object.assign({} , init,{ [next] : 1 }) , {});
        options.addFields = [
            {
                name : "_dynamicTable",
                label : "Choose Your Created Dynamic Table",
                type : "joinByOne",
                withType : "dynamic-tables",
                filters: {
                    projection: Object.assign({}, {
                        title: 1,
                        data: 1,
                        ajaxURL: 1,
                        id: 1,
                    }, fields)
                }
            }
        ].concat(options.addFields || []);

        options.tabulatorOptions = options.tabulatorOptions || {
            layout: 'fitColumns',
            autoColumns: true,
            responsiveLayout: true
        };
    },
    afterConstruct : function(self){
        // Allow devs to extend it
        self.pushAssets();
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;
        self.table = self.apos.dynamicTable;

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

        self.addHelpers({
            tabulator: function(value) {
                var newOptions = {}
                var acceptKey = ["data", "ajaxURL"].concat(callbackFields.fields.filter((val) => val !== 'callbacks') || []);

                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        if (acceptKey.includes(key) && value[key] && value[key].length > 0) {
                            newOptions[key] = value[key];
                        }
                    }
                }

                return JSON.stringify(newOptions);
            }
        })

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

            self.pushAsset('stylesheet', 'tabulator/tabulator.min',{
                when: "always"
            })

            if(self.apos.assets.options.lean){
                if(options.player){
                    self.pushAsset('script', 'lean', {
                        when: "lean"
                    });
                }
            }else{
                self.pushAsset('script', 'always', {
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
            options.dynamicTableSchemas = self.apos.dynamicTable.tableSchemas;
            options.tabulatorOptions = self.options.tabulatorOptions;
            return options;
        };
    }
}