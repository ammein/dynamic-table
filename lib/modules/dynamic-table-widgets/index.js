module.exports = {
    extend : "apostrophe-widgets",
    label : "Table Widget",
    scene : "user",
    beforeConstruct : function(self,options){
        options.addFields =  [
            {
                name: 'row',
                label: 'Row',
                type: 'integer'
            },
            {
                name : 'column',
                label : 'Column',
                type : 'integer'
            },
            {
                name: "data",
                label: "Convert Data",
                type: "string",
                readOnly: true
            }
        ].concat(options.addFields || []);
        options.arrangeFields = [
            {
                name : "table",
                label : "Table Setting",
                fields : ["row" , "column"]
            },
            {
                name : "settings",
                label : "Settings",
                fields : ["data"]
            }
        ].concat(options.arrangeFields || []);
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;

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
            superPushAssets();

            self.pushAsset('script', 'editor', {
                when : "user"
            });

            self.pushAsset('script', 'datatables$/datatables.min', {
                when: "always"
            });

            self.pushAsset('stylesheet', 'jquery/datatables.min', {
                when: "always"
            })

            if(self.apos.assets.options.lean){
                if(options.player){
                    self.pushAsset('script', 'datatablesJS/datatables.min', {
                        when: "lean"
                    });

                    self.pushAsset('script', 'lean', {
                        when: "lean"
                    });

                    self.pushAsset('stylesheet', 'vanillaJS/datatables.min', {
                        when: "lean"
                    })
                }
            }
        }

        // Extend Options to get on browser apostrophe-widgets JS
        var superGetCreateSingletonOptions = self.getCreateSingletonOptions;
        self.getCreateSingletonOptions = function (req) {
            var options = superGetCreateSingletonOptions(req);
            options.table = self.myData;
            return options;
        };
    }
}