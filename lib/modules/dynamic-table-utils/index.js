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
            self.apos.push.browserMirrorCall('user', self , { stop : "dynamic-table-utils" });
            self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options);
        }
    }
}