function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
exports.command = function insertCallback(options, checkboxName) {
    var checkbox = `input[name="callbacks"][value="${checkboxName}"]`;
    var self = this;
    return self
        .waitForModal('dynamic-table-editor-modal')
        .execute(function(){
            var callbackTab = Array.prototype.slice.call(document.querySelectorAll("[data-apos-modal-current='dynamic-table-editor-modal'] [data-apos-form] .apos-schema-tabs div")).filter((val, i, arr) => {
                return val.textContent.match(/Tabulator Callback/g)
            })[0];

            if(callbackTab.className.match(/apos-active/g)) {
                return true;
            } else{
                callbackTab.click();
                return true
            }
        },[], function(result){
            console.log("Tabulator Callback Tab Successfully clicked");
        })
        .execute(function(checkbox){
            var checked = document.querySelector(`[data-apos-modal-current='dynamic-table-editor-modal'] ${checkbox}`).checked;

            if(checked) {
                return false;
            } else {
                return true;
            }
        }, [checkbox], function(result){
            var capitalizeCheckboxName = capitalizeFirst(checkboxName);
            if(result.value) {
                console.log(`Click checkbox name '${checkboxName}'`);
                self
                    .click('xpath', `//div[contains(normalize-space(label),'${capitalizeCheckboxName} Callback')][not(@disabled)]/label/input[@name='callbacks'][not(@disabled)]/following-sibling::span`)
                    // //fieldset[@data-name='tableCallback'][not(../@data-apos-workflow-live-field)]
            } else {
                console.log(`Checkbox name '${checkboxName}' is already active`);
            }
        })
        .execute(function(checkboxName) {
            var fieldsetCallback = document.querySelector(`fieldset.apos-hidden[data-name='${checkboxName}Callback']`);

            if (fieldsetCallback){
                
            }
        }, [checkboxName], function(result){

        })
        .execute(function(options, checkboxName) {
            var callback = JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(apos.customCodeEditor[checkboxName + "Callback"].editor.session.getValue()));

            // Loop in `callback` and insert new function code to replace it as test
            for(let key in callback) {
                if (callback.hasOwnProperty(key)){
                    var optionsKey = Object.keys(options).filter(val => val === key).length > 0 ? Object.keys(options).filter(val => val === key)[0] : ""
                    if(key === optionsKey) {
                        callback[key] = options[key];
                    }
                }
            }

            apos.customCodeEditor[checkboxName + "Callback"].editor.session.setValue(callback);

            return {
                newCallback : callback,
                success: JSONfn.stringify(callback) !== JSONfn.stringify(options)
            }
        }, [options, checkboxName] , function(result){
            self.pause();
            self.assert.ok(result.value.success);
            console.log("New Callback : \n", result.value.newCallback)
        });
}