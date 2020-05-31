let counter = 0;
const JSONfn = require("jsonfn").JSONfn;
module.exports = (options, performCallback, edit = false) => {
    counter++
    return {
        [`[${counter}] Create New Dynamic Table Piece`] : function(client) {
            const columnInput = '[name=column]';
            const rowInput = '[name=row]';
            var data = "";
            var callbackResult = {};
            var optionsResult = {};
            client.openDynamicTable();

            if (edit) {
                console.log('Running Edit Table');
                client.editTable(options.title);
            } else {
                console.log('Running Add New Table')
                client.addNewTable();
            }
            // Make sure that div.dynamic-table-area is available in that modal
            client.assert.visible('div.dynamic-table-area');
            // Set title to be Default Table

            // Loop through Options
            for (let key in options){
                if (options.hasOwnProperty(key)){
                    // Make sure filter to those options that is not included in callbacks
                    if (key !== "callbacks" && key !== "load") {
                        switch (key) {
                            case "column":
                                client.click(columnInput, function () {
                                    client.pause(500);
                                    client.expect.element(columnInput).to.be.enabled;
                                })
                                client.resetValueInModal('dynamic-table-editor-modal', `[name="${key}"]`, options[key]);

                                client.getValue('[data-apos-modal-current="dynamic-table-editor-modal"] [name=data]', function (result) {
                                    data = result.value;
                                })
                                break;

                            default:
                                client.resetValueInModal('dynamic-table-editor-modal', `[name="${key}"]`, options[key]);
                                break;
                        }
                    }
                }
            }

            // If got callbacks, insert callbacks
            if (options.callbacks) {
                for (let key in options.callbacks) {
                    if (options.callbacks.hasOwnProperty(key)){
                        client.insertCallback(options.callbacks[key], key, function(result, done){
                            callbackResult = Object.assign({}, callbackResult, result);
                            done();
                        })
                    }
                }
            }

            if (options.load) {
                client.clickModalDropdown("dynamic-table-editor-modal", "upload", "[data-apos-loadcsv]");
                client.setValue("input[type='file']", options.load, function(result){
                    if(result !== 0){
                        console.log(result);
                    }
                });
                client.execute(function(){
                    var getData = apos.dynamicTableUtils.getTableData()
                    return {
                        success: Object.getOwnPropertyNames(getData).length > 0,
                        data: JSONfn.stringify(getData)
                    }
                }, [], function(result){
                    client.assert.ok(result.value.success, "getTableData() test");
                    data = result.value.data;
                })
            }

            if(options.options) {
                for(let key in options.options){
                    if (options.options.hasOwnProperty(key)){
                        client.tabulatorOptions(options.options[key], key, function(result, done){
                            optionsResult = Object.assign({}, optionsResult, result)               
                            done();
                        })
                    }
                }
            }

            // Pass the callback to do client perform anything on data changes
            client
                .perform(function (client, done) {
                    performCallback(client, {
                        data: data,
                        callbackResult: JSONfn.stringify(callbackResult),
                        originalCallback: JSONfn.stringify(options.callbacks),
                        optionsResult: JSONfn.stringify(optionsResult)
                    }, done);
                });
            // Save and close modal. Make sure there is no modal appear
            client.saveTableAndClose();
        }
    }
}