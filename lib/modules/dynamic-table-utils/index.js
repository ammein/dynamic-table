const _ = require("lodash");
module.exports = {
    alias : "dynamicTableUtils",
    afterConstruct : function(self){
        self.pushAssets();
        self.allBrowserCalls();
    },
    construct : function(self,options){

        self.pushAssets = function () {
            self.pushAsset('script', 'utils', {
                when: "user"
            });
        }

        self.allBrowserCalls = function(){
            var options = {}            
            _.defaults(options.browser , {
                action : self.action,
                name : self.__meta.name,
                browser : {
                    test :"Hey"
                }
            })
            self.apos.push.browserMirrorCall('user', self , { stop : "dynamic-table-utils" });
            self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options.browser);
        }
    }
}