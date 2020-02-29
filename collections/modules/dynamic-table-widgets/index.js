const async = require('async');
const callbackFields = require('../../../callbackFields.js').arrangeFields;
const JSONfn = require('jsonfn').JSONfn;
module.exports = {
    extend : "apostrophe-widgets",
    label : "Table Widget",
    alias: 'tableWidget' ,
    scene : "user",
    beforeConstruct : function(self,options){
        options.addFields = [
            {
                name : '_dynamicTable',
                label : 'Choose Your Created Dynamic Table',
                type : 'joinByOne',
                withType : 'dynamic-tables'
            }
        ].concat(options.addFields || []);
    },
    afterConstruct : function(self){
        // Allow devs to extend it
        self.pushAssets();
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;
        self.table = self.apos.dynamicTable;

        const adjustJoin = options.addFields.filter(val => val.name === '_dynamicTable').map(obj => {

            let browserSchemas = self.table.options.addFields.filter(val => val.browserSchema).reduce((init, next) => {
                return Object.assign({}, init, { [next.name]: 1 })
            }, {});

            return obj['filters'] = {
                projection: browserSchemas
            }
        })

        options.addFields = options.addFields.map((val, i) => {
            if (val.name === adjustJoin[i].name) {
                return adjustJoin[i];
            } else {
                return val;
            }
        })

        // Override but pass extra data (data.something)
        self.output = function (widget, options) {
            return self.partial(self.template, {
                widget: widget,
                options: options,
                manager: self
            });
        };

        self.addHelpers({
            tabulator: function(value) {
                var newOptions = {}
                var acceptKey = self.table.tableSchemas.filter(val => val.browserSchema).map(obj => obj.name);
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        if ((acceptKey.includes(key) && ((typeof value[key] === 'string' && value[key].length > 0) || value[key]))) {
                            newOptions[key] = value[key];
                        }
                    }
                }

                return JSON.stringify(newOptions);
            },
            originalOptionsTabulator : function(){
                return JSONfn.stringify(self.table.options.tabulatorOptions)
            }
        })

        self.pushAssets = function(){
            self.pushAsset('script', 'editor', {
                when : 'user'
            });

            if(self.apos.assets.options.lean){
                if(options.player){
                    self.pushAsset('script', 'lean', {
                        when: 'lean'
                    });
                }
            }else{
                self.pushAsset('script', 'always', {
                    when: 'always'
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
            options.tabulatorOptions = self.table.options.tabulatorOptions;
            return options;
        };
    }
}