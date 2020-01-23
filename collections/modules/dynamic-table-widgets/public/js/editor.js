apos.define('dynamic-table-widgets-editor', {
    extend: "apostrophe-widgets-editor",
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superBeforeSave = self.beforeSave;
        var superAfterShow = self.afterShow;
        self.dynamicTablePieces = apos.dynamicTable;

        self.beforeShow = function(callback){
            return superBeforeShow(function(err){
                if(err){
                    return callback(err);
                }

                // Use my own utils for beforeShow
                apos.dynamicTableUtils.beforeShowDynamicTable.call(self, self.$form, self.options.data);

                return callback(null);
            });
        }

        self.afterShow = function(){
            superAfterShow();

            apos.dynamicTableUtils.afterShowDynamicTable.call(self, self.$form, self.options.data);
        }

        self.beforeSave = function(callback){
            return superBeforeSave(function(err){
                if(err){
                    return callback(err);
                }

                return apos.dynamicTableUtils.beforeSave(callback);
            });
        }

    }
})