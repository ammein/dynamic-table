apos.define("apostrophe-array-editor-modal",{
    construct : function(self,options){
        var superAfterShow = self.afterShow;
        var superAfterHide = self.afterHide;


        self.afterShow = function(){
            if(options.field.moduleName === "dynamic-table"){
                // pass to options.arrayItems before .load() is invoke on superAfterShow below...
                options.arrayItems = apos.dynamicTableUtils.arrayFieldsArrange(options.arrayItems ? options.arrayItems : [], options.field.name);
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