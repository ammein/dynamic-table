apos.define('dynamic-table-editor-modal', {
    extend: 'apostrophe-pieces-editor-modal',
    construct: function(self, options) {
        let superBeforeShow = self.beforeShow;
        let superAfterShow = self.afterShow;
        self.dynamicTablePieces = apos.dynamicTable;
        var myOptions = {}
        myOptions.id = options["_id"];

        self.beforeShow = function (callback) {
            return superBeforeShow(function (err) {
                if (err) {
                    return callback(err);
                }

                // Use my own utils for beforeShow & Also to be available to call `this.link`
                apos.dynamicTableUtils.beforeShowDynamicTable.call(self, self.$form, myOptions);

                return callback(null);
            });
        }

        self.afterShow = function () {
            superAfterShow();
            // Use my own utils for afterShow & Also to be available to call `this.link
            apos.dynamicTableUtils.afterShowDynamicTable.call(self, self.$form, myOptions);
        }

    }
})