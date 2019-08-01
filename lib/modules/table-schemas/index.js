module.exports = {
    // later change from `extend` to `improve` for publishing moog bundle npm modules
    improve : "apostrophe-schemas",
    construct : function(self,options){
        debugger;
        var superPushAssets = self.pushAssets;
        self.pushAssets = function(){
            superPushAssets();
            self.pushAsset("script", "schema", {
                when : "user"
            })
        }
    }
}