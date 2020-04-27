exports.command = function insertCallback(options, checkboxName) {
    var checkbox = `input[name='callbacks'][value='${checkboxName}']`;
    var self = this;
    return self
        .waitForModal('dynamic-table-editor-modal')
        .execute(function(checkbox){
            var checked = document.querySelector(`[data-apos-modal-current='dynamic-table-editor-modal'] ${checkbox}`).checked;

            if(checked) {
                return false;
            } else {
                return true;
            }
        }, [checkbox], function(result){
            if(result.value) {
                console.log(`Click checkbox name '${checkboxName}'`)
                self.waitForElementReady(checkbox);
                self.clickInModal('dynamic-table-editor-modal', checkbox);
                return;
            } else {
                console.log(`Checkbox name '${checkboxName}' is already active`);
                return;
            }
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
            self.assert.ok(result.value.success);
            console.log("New Callback : \n", result.value.newCallback)
        });
}