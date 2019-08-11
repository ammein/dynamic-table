apos.define("dynamic-table-editor-modal" , {
    extend: 'apostrophe-pieces-editor-modal',
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superAfterShow = self.afterShow;
        var superAfterConvert = self.afterConvert;
        self.dynamicTablePieces = apos.dynamicTable;

        self.beforeShow = function (callback) {
            return superBeforeShow(function (err) {
                if (err) {
                    return callback(err);
                }

                // Use my own utils for beforeShow
                apos.dynamicTableUtils.beforeShowDynamicTable(self.$form, self.options.data);

                return callback(null);
            });
        }

        self.afterShow = function () {
            superAfterShow();

            apos.dynamicTableUtils.afterShowDynamicTable(self.$form, self.options.data);
        }

        self.afterConvert = function(piece,callback){
            return superAfterConvert(apos.dynamicTableUtils.afterConvert(piece) ,callback);
        }

    }
})