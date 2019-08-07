const _ = require("lodash");
// This is literally a new module. Trying to figure out without devs need to include it on modules : {}
module.exports = {
    alias : "dynamicTableUtils",
    afterConstruct : function(self){
        self.pushAssets();
        self.allBrowserCalls();
    },
    construct : function(self,options){

        // Try to manually put on self.apos.modules[self.__meta.name] = {}
        self.modulesReady = function(){
            // Try dynamically set the modules
            self.apos.modules[self.__meta.name] = self;
        }

        self.pushAssets = function () {
            self.pushAsset('script', 'utils', {
                when: "user"
            });
        }

        self.allBrowserCalls = function(){
            var options = {}            
            _.defaults(options , {
                browser : {}
            })

            _.extend(options.browser , {
                action : self.action,
                data : {
                    test : "Hey"
                }
            })
            // Make it stop until this NEW MODULE. If not, the instantiate will stopped
            self.apos.push.browserMirrorCall('user', self , { stop : "dynamic-table-utils" });
            self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options.browser);
        }
    }
}