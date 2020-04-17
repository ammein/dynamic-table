// Test Create new table with default options
const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
    {
        before: (client, done) => {
            const { apos_address, apos_port } = client.globals;
            console.log(process.argv);
            console.log('IN START');
            client.resizeWindow(1200, 800);
            if (!this._server) {
                this._server = server.create(apos_address, apos_port);
                this._server.task('dynamic-table:delete');
                this._server.start(done);
            }
        },
        after: (client, done) => {
            console.log('IN AFTER');
            client.end(() => {
                console.log('STOPPING FROM AFTER');
                this._server.stop(done);
            });
        }
    },
    // Execute various steps found in the module
    steps.navigateToHome(),
    steps.login(),
    {
        'Create new table with default options' : (client) => {
            var settingsTab = '[data-apos-open-group="settings"]';
            var titleInput = 'input[name=title]';
            var slugInput = 'input[name=slug]';
            var rowInput = 'input[name=row]';
            var columnInput = 'input[name=column]';
            client.openDynamicTable();
            client.addNewTable();
            // Make sure that div.dynamic-table-area is available in that modal
            client.assert.visible('div.dynamic-table-area');
            // Set title to be Default Table
            client.setValue(titleInput, 'Default Table');
            // Make sure that the slug is automatically created based on title inputs
            client.clickInModal('dynamic-table-editor-modal', settingsTab);
            client.waitForElementVisible(slugInput);
            client.expect.element(slugInput).to.have.value.which.equal("default-table");
            client.addRow(client.Keys.NUMPAD3);
            client.click(columnInput, function(){
                client.pause(500);
                client.expect.element(columnInput).to.be.enabled;
            })
            client.addColumn(client.Keys.NUMPAD2);

            // Make sure all those value is inserted
            client.assert.value(rowInput, "3");
            client.assert.value(columnInput, "2");

            // Save and close modal. Make sure there is no modal appear
            client.saveTableAndClose();
        }
    }
);