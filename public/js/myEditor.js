apos.define('dynamic-table-editor-modal', {
    extend: 'apostrophe-pieces-editor-modal',
    construct: function(self, options) {
        let superBeforeShow = self.beforeShow;
        let superAfterShow = self.afterShow;
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

    }
})