const JSONfn = require("jsonfn").JSONfn;
exports.command = function insertCallback(options, checkboxName, callback) {
    var self = this;
    var callbackReturn = {}
    return self
        .clickTabInModal("dynamic-table-editor-modal", "Tabulator Callback")
        .checkboxInModal("dynamic-table-editor-modal", "callbacks", checkboxName, function (result) {
            if (result.value) {
                console.log(`Checkbox name '${checkboxName}' is not active`);
                self.click('xpath', `//input[@value='${checkboxName}'][not(@disabled)]/following-sibling::span`);
            } else {
                console.log(`Checkbox name '${checkboxName}' is already active`);
            }
        })
        .getLocationInView(`fieldset[data-name='${checkboxName}Callback']`)
        .execute(function(options, checkboxName) {
            var callback = JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(apos.customCodeEditor[checkboxName + "Callback"].editor.session.getValue()));

            var previousCallback = Object.assign({}, callback);

            var parseOptions = JSONfn.parse(options);

            for (let key in callback) {
                if (callback.hasOwnProperty(key)) {
                    var optionsKey = Object.keys(parseOptions).filter(val => val === key).length > 0 ? Object.keys(parseOptions).filter(val => val === key)[0] : null
                    if (key === optionsKey) {
                        console.log("Match key in loop!")
                        callback = Object.assign({}, callback, {
                            [key]: parseOptions[key]
                        });
                    }
                }
            }

            apos.customCodeEditor[checkboxName + "Callback"].editor.session.setValue(apos.customCodeEditor.tabulator.convertToString(callback));

            return {
                success: JSONfn.stringify(callback) !== JSONfn.stringify(previousCallback),
                callback: JSONfn.stringify(callback)
            }
        }, [JSONfn.stringify(options), checkboxName] , function(result){
            self.assert.ok(result.value.success);
            callbackReturn = Object.assign({}, {
                [checkboxName] : JSONfn.parse(result.value.callback)
            })
        })
        .perform(function(done){
            callback(callbackReturn, done);
        });
}