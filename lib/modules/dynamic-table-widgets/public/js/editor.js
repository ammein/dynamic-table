apos.define('dynamic-table-widgets-editor', {
    extend: "apostrophe-widgets-editor",
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superBeforeSave = self.beforeSave;
        var superAfterShow = self.afterShow;
        self.dynamicTablePieces = apos.dynamicTable;

        self.EditorDataTableOptions = apos.dynamicTableUtils.EditorDataTableOptions;

        self.beforeShow = function(callback){
            return superBeforeShow(function(err){
                if(err){
                    return callback(err);
                }

                // Pass to Utils
                apos.dynamicTableUtils.$form = self.$form;
                
                // Must always reset rowData & columnData
                apos.dynamicTableUtils.rowData = [];
                apos.dynamicTableUtils.columnData = [];

                // Use my own utils for beforeShow
                self.beforeShowDynamicTable();

                return callback(null);
            });
        }

        self.afterShow = function(){
            superAfterShow();

            apos.dynamicTableUtils.afterShowDynamicTable();
        }

        self.beforeSave = function(callback){
            return superBeforeSave(function(err){
                if(err){
                    return callback(err);
                }

                // TODO : Do HTML TABLE to be send to server
                return self.api("submit", {
                            table: {
                                data: apos.dynamicTableUtils.rowData,
                                columns: apos.dynamicTableUtils.columnData
                            }
                        }, function (data) {
                    if(data.status === "success"){
                        return callback(null);
                    }

                    return callback(null,"Error : " + data.message);
                }, function(err){
                    return callback(err);
                })
            })
        }
    }
})