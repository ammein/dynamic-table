const JSONfn = require("jsonfn").JSONfn;
exports.command = function insertCallback(options, checkboxName, callback) {
    var checkbox = `input[name="callbacks"][value="${checkboxName}"]`;
    var self = this;
    var callbackReturn = {}
    return self
        .execute(function(){
            var callbackTab = Array.prototype.slice.call(document.querySelectorAll("[data-apos-modal-current='dynamic-table-editor-modal'] [data-apos-form] .apos-schema-tabs div")).filter((val, i, arr) => {
                return val.textContent.match(/Tabulator Callback/g)
            })[0];

            if(callbackTab.className.match(/apos-active/g)) {
                return true;
            } else{
                callbackTab.click();
                return true;
            }
        },[], function(result){
            console.log("Tabulator Callback Tab is active");
        })
        .execute(function(checkbox){
            var checked = document.querySelector(`[data-apos-modal-current='dynamic-table-editor-modal'] ${checkbox}`).checked;

            if(checked) {
                return false;
            } else {
                return true;
            }
        }, [checkbox], function(result){
            if(result.value) {
                console.log(`Checkbox name '${checkboxName}' is not active`);
                self.click('xpath', `//input[@value='${checkboxName}'][not(@disabled)]/following-sibling::span`)
                    
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