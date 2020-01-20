/* global JSONfn */
let callbacks = function(self, options) {
    self.resetCallbacksOptions = function () {
        let schemaCallbacks = self.tabulator.schemas.filter(function (val) {
            return val.name === 'callbacks';
        })[0].choices.reduce(function (init, next, i, arr) {
            return Object.assign({}, init, JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(self.tabulator.callbackStrings(next.showFields[0]))))
        }, {});

        for (let key in self.tabulator.options) {
            if (self.tabulator.options.hasOwnProperty(key)) {
                if (schemaCallbacks[key]) {
                    delete self.tabulator.options[key];
                }
            }
        }

        // Restart Table
        self.restartTable();

        // Reset Callbacks Value
        self.setCallbacksValue(true)
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
            return apos.notify('Callbacks Reset! Please save your table to confirm reset.', {
                type: 'success'
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

    self.setCallbacksValue = function (reset) {
        if (reset) {
            return apos.customCodeEditor.tabulator.setValue(self.$form, apos.schemas.tabulator.schema.filter(function (val) {
                return val.name === 'callbacks';
            })[0].choices.reduce((init, next, i, arr) => init.concat(next.value + 'Callback'), []), reset);
        } else {
            return apos.customCodeEditor.tabulator.setValue(self.$form, apos.schemas.tabulator.schema.filter(function (val) {
                return val.name === 'callbacks';
            })[0].choices.reduce((init, next, i, arr) => init.concat(next.value + 'Callback'), []));
        }
    }

}

export default callbacks;