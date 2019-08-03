module.exports = {
    improve : "apostrophe-modal",
    construct : function(self,options){
        var superPushAssets = self.pushAssets;

        self.pushAssets = function(){
            superPushAssets();

            self.pushAsset('stylesheet', 'editorTable', {
                when: "user"
            })
        }
    }
}