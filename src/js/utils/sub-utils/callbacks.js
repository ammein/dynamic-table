/* global JSONfn */
let callbacks = function(self, options) {
    self.resetCallbacksOptions = function () {
        let schemaCallbacks = self.$callbacks.data().aposChoices.reduce(function (init, next, i, arr) {
            return Object.assign({}, init, JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(self.tabulator.callbackStrings(next.showFields[0]))))
        }, {});

        // Restart Table
        self.restartTable();

        // Reset Callbacks Value
        self.setCallbacksValue(true);

        // Reset Options Callbacks
        for (let key in self.tabulator.options) {
            if (self.tabulator.options.hasOwnProperty(key)) {
                if (schemaCallbacks[key] && Object.keys(self.tabulator.options).includes(key)) {
                    delete self.tabulator.options[key];
                }
            }
        }
    }

    self.resetCallbacks = function () {
        return self.resetCallbacksApi({
            id: self.$id.val() || ''
        }, function (err) {
            if (err) {
                apos.utils.warn('Unable to reset callbacks', err);
                apos.notify('Oops ! Something went wrong!', {
                    dismiss: true,
                    type: 'error'
                })
                return;
            }

            self.resetCallbacksOptions();
            return apos.notify('Callbacks Reset!', {
                type: 'success',
                dismiss: true
            });
        })
    }

    self.tabulator.callbackStrings = function (editorType) {
        let strings = '';
        if (Object.getOwnPropertyNames(self.tabulator.callbacks).length > 0) {
            strings = typeof self.tabulator.callbacks[editorType] !== 'string' ? apos.customCodeEditor.tabulator.convertToString(self.tabulator.callbacks[editorType]) : self.tabulator.callbacks[editorType];
        } else {
            strings = '{}'
        }
        return strings;
    }

    self.setCallbacksValue = function (reset = false) {
        if (reset) {
            return apos.customCodeEditor.tabulator.setValue(self.$form, self.$callbacks.data().aposChoices.reduce((init, next, i, arr) => init.concat(next.value + 'Callback'), []), reset);
        } else {
            return apos.customCodeEditor.tabulator.setValue(self.$form, self.$callbacks.data().aposChoices.reduce((init, next, i, arr) => init.concat(next.value + 'Callback'), []));
        }
    }

}

export default callbacks;