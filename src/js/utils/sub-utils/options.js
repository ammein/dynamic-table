let options = function(self, options) {
    /**
     * This will setOptionsValue to tabulatorOptions custom-code-editor
     */
    self.setOptionsValue = function(reset = false) {
        if (reset) {
            return apos.customCodeEditor.tabulator.optionsValue(self.$form, self.$options.data().name, Object.assign({}, self.originalOptionsTabulator, self.tabulator.options.ajaxURL ? { 'ajaxURL': self.tabulator.options.ajaxURL } : {}), reset);
        } else {
            return apos.customCodeEditor.tabulator.optionsValue(self.$form, self.$options.data().name, self.tabulator.options);
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
                apos.utils.warn('Unable to reset options', err);
                apos.notify('Opps! Something went wrong!', {
                    type: 'error',
                    dismiss: true
                })
            }
            // Reset Options
            self.setOptionsValue(true);
            self.restartTable();
            return apos.notify('Options Reset!', {
                type: 'success',
                dismiss: true
            });
        })
    }
}

export default options;