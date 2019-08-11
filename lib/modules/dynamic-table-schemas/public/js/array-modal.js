apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;
        var superAfterHide = self.afterHide;


        self.afterShow = function(){
            // We can access which fields is enable here by options.field
            // Detect options.field.name here using switch or anything !
            if(options.field.moduleName === "dynamic-table"){
                self.arrayItems = apos.dynamicTableUtils.arrayFieldsArrange(self.arrayItems ? self.arrayItems : [], options.field.name);
                self.originalArrayItems = _.cloneDeep(self.arrayItems);
                // Refresh the view
                self.refresh();
            }

            // Load next
            superAfterShow();
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