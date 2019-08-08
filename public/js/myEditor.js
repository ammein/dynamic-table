apos.define("dynamic-table-editor-modal" , {
    extend: 'apostrophe-pieces-editor-modal',
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superAfterShow = self.afterShow;
        self.dynamicTablePieces = apos.dynamicTable;

        self.EditorDataTableOptions = apos.dynamicTableUtils.EditorDataTableOptions;

        self.beforeShow = function (callback) {
            return superBeforeShow(function (err) {
                if (err) {
                    return callback(err);
                }

                // Pass to Utils
                apos.dynamicTableUtils.$form = self.$form;

                // Must always reset rowData & columnData
                apos.dynamicTableUtils.rowData = [];
                apos.dynamicTableUtils.columnData = [];

                // Use my own utils for beforeShow
                apos.dynamicTableUtils.beforeShowDynamicTable();

                return callback(null);
            });
        }

        self.afterShow = function () {
            superAfterShow();

            apos.dynamicTableUtils.afterShowDynamicTable();
        }

    }
})