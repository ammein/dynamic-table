apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;
        var superAfterHide = self.afterHide;

        self.originalArrayItems = _.cloneDeep(self.arrayItems);

        self.afterShow = function(){
            superAfterShow();
            debugger;
            // We can access which fields is enable here by options.field
            // Detect options.field.name here using switch or anything !
            // self.options.arrayItems = apos.dynamicTableUtils.arrayFieldsArrange(self.options.arrayItems, options.field.name);
        }

        self.afterHide = function(){
            superAfterHide();
            // After hide, must refresh table and reinsert Row & column data
            
            debugger;
        }
    }
})