apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;

        self.afterShow = function(){
            superAfterShow();
            debugger;
        }
    }
})