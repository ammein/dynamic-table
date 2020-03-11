let options = function(self, options) {
    /**
     * This will setOptionsValue to tabulatorOptions custom-code-editor
     */
    self.setOptionsValue = function (reset = false, additionalOptions = {}) {
        if (reset) {
            return apos.customCodeEditor.tabulator.optionsValue(self.$form, self.$options.data().name, Object.assign({}, self.originalOptionsTabulator, self.tabulator.options.ajaxURL ? { 'ajaxURL': self.tabulator.options.ajaxURL } : {}, additionalOptions), reset);
        } else {
            return apos.customCodeEditor.tabulator.optionsValue(self.$form, self.$options.data().name, Object.assign({}, self.tabulator.options, additionalOptions));
        }
    }

    /**
     * To Reset Options Callback API
     */
    self.resetOptions = function() {
        self.resetOptionsApi({
            id: self.$id.val() || ''
        }, function(err) {
            if (err) {
                apos.utils.warn('Unable to reset options: \n', err);
                apos.notify('Opps! Something went wrong!', {
                    type: 'error',
                    dismiss: true
                });
            }
            // Reset Options & if it is a custom table, automatically pass the data for `autoColumns: false`
            self.setOptionsValue(true, Object.assign({}, self.rowsAndColumns.length > 0 ? { autoColumns: false } : {}));
            self.hardReloadTable();
            return apos.notify('Options Reset!', {
                type: 'success',
                dismiss: true
            });
        })
    }
}

export default options;