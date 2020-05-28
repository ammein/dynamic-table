function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.substr(1);
}
exports.command = function insertCallback(options, checkboxName) {
    var checkbox = `input[name="callbacks"][value="${checkboxName}"]`;
    var callback = {};
    var newCallback = {};
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
                if(fieldsetCallback.classList.contains('apos-hidden')) {
                    fieldsetCallback.classList.remove('apos-hidden');
                }
                document.querySelector("[data-apos-modal-current='dynamic-table-editor-modal'] [data-apos-dropdown-name='reset']").click();
                document.querySelector("[data-apos-modal-current='dynamic-table-editor-modal'] [data-apos-resetcallbacks]").click();
                return true;
            }else {
                return false;
            }
        }, [checkboxName], function(result){
            if(result.value) {
                console.log("Reset Callbacks has been reset");
                self
                    .getLocationInView(`fieldset[data-name='${checkboxName}Callback']`)
                    .pause(5000);
            } else {
                console.log("The Callback is already set");
            }
        })
        .execute(function(myOptions, checkboxName) {
            var callback = JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(apos.customCodeEditor[checkboxName + "Callback"].editor.session.getValue()));

            return {
                success: callback ? true: false,
                callback: callback
            }
        }, [options, checkboxName] , function(result){
            self.assert.ok(result.value.success);
            callback = Object.assign({}, result.value.callback);
        })
        .perform(function(done){
            // Loop in `callback` and insert new function code to replace it as test
            console.log("Begin Loop. Callback value: ", callback)
            for (let key in callback) {
                if (callback.hasOwnProperty(key)) {
                    console.log("Running Callback Loop");
                    var optionsKey = Object.keys(options).filter(val => val === key).length > 0 ? Object.keys(options).filter(val => val === key)[0] : ""
                    if (key === optionsKey) {
                        console.log("Match key in loop!")
                        newCallback = Object.assign({}, callback, {
                            [key]: options[key]
                        });
                    }
                }
            }
            console.log("Finish Loop. New Callback value: ", newCallback.tableBuilding);
            done();
        })
        .execute(function(callback, checkboxName){
            var previousCallback = JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(apos.customCodeEditor[checkboxName + "Callback"].editor.session.getValue()));

            apos.customCodeEditor[checkboxName + "Callback"].editor.session.setValue(apos.customCodeEditor.tabulator.convertToString(callback));
            
            return JSONfn.stringify(callback) !== JSONfn.stringify(previousCallback)
        }, [newCallback, checkboxName], function(result){
            self.assert.ok(result.value);
            self.pause(1000);
        })
}