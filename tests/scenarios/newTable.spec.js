// tests/scenarios/article.spec.js
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
            client.openAdminBarItem('dynamic-table');
            client.waitForModal('dynamic-table-manage-modal');
            client.clickWhenReady('[data-apos-create-dynamic-tables]')
        }
    }
);