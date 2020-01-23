module.exports = {
    improve : "apostrophe-schemas",
    construct : function(self,options){
        var superPushAssets = self.pushAssets;

        self.pushAssets = function(){
            superPushAssets();
            
            self.pushAsset("stylesheet", "editorTable", {
                when : "user"
            })
        }
    }
}