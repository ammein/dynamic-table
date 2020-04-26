// Test Create new table with default options
const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const mySteps = require('../steps');

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
        },
    },
    steps.navigateToHome(),
    steps.login(),
    mySteps.tableWidget('.dynamic-table', 'dynamic-table', 'Default Table'),
);