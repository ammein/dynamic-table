let counter = 0;
module.exports = (options, performCallback) => {
    counter++
    return {
        [`[${counter}] Create New Dynamic Table Piece`] : function(client) {
            const columnInput = '[name=column]';
            const rowInput = '[name=row]';
            var data = "";
            client.openDynamicTable();
            client.addNewTable();
            // Make sure that div.dynamic-table-area is available in that modal
            client.assert.visible('div.dynamic-table-area');
            // Set title to be Default Table

            // Loop through Options
            for (let key in options){
                if (options.hasOwnProperty(key)){
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

                            // Pass the callback to do client perform anything on data changes
                            client.perform(function (client, done) {
                                performCallback(client, data, done);
                            });
                            break;
                    
                        default:
                            client.resetValueInModal('dynamic-table-editor-modal', `[name="${key}"]`, options[key]);
                            break;
                    }
                }
            }
            // Save and close modal. Make sure there is no modal appear
            client.saveTableAndClose();
        }
    }
}