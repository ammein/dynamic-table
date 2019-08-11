apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;
        var superAfterHide = self.afterHide;


        self.afterShow = function(){
            self.originalArrayItems = _.cloneDeep(self.arrayItems);            
            superAfterShow();
            // We can access which fields is enable here by options.field
            // Detect options.field.name here using switch or anything !
            if(options.field.moduleName === "dynamic-table"){
                self.options.arrayItems = apos.dynamicTableUtils.arrayFieldsArrange(self.options.arrayItems ? self.options.arrayItems : [], options.field.name);
                // Refresh the view
                self.refresh();
            }
        }

        self.afterHide = function(){
            superAfterHide();
            if (options.field.moduleName === "dynamic-table") {
                // After hide, must refresh table and reinsert Row & column data
                apos.dynamicTableUtils.updateFromArrayFields(self.options.arrayItems ? self.options.arrayItems : [], options.field.name);
                // Reinit table
                apos.dynamicTableUtils.initTable();
            }
        }
    }
})