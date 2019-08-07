module.exports = {
    extend : 'apostrophe-module',
    name : 'dynamic-table-utils',
    afterConstruct : function(self,options){
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
            self.apos.push.browserMirrorCall('user', self);
        }
    }
}