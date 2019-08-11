apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;

        self.afterShow = function(){
            superAfterShow();
            debugger;
            // We can access which fields is enable here by options.field
            // Detect options.field.name here using switch or anything !
            // self.options.arrayItems = apos.dynamicTableUtils.arrayFieldsArrange(self.options.arrayItems, options.field.name);
        }
    }
})