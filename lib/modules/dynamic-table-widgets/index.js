module.exports = {
    extend : "apostrophe-widgets",
    label : "Table Widget",
    scene : "user",
    afterConstruct : function(self){
        // Allow devs to extend it
        self.pushAssets();
    },
    construct : function(self,options){
        var superPushAssets = self.pushAssets;
        var superPageBeforeSend = self.pageBeforeSend;
        self.table = self.apos.dynamicTable;

        options.addFields = self.table.tableSchemas;

        self.pageBeforeSend = function(req){
            var req = superPageBeforeSend(req);
            debugger;
            return req;
        }

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
            self.pushAsset('script', 'editor', {
                when : "user"
            });

            self.pushAsset("script", 'vendor/json5/json5', {
                when : "always"
            })

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
            options.table = self.myData;
            return options;
        };
    }
}