// Test Create new table with default options
const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const mySteps = require('../steps');
const JSONfn = require('jsonfn').JSONfn;
const utils = require('../utils');
let myCallback = {
    table: {
        tableBuilding: function () {
            console.log('Table is building');
        }
    }
};
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
    mySteps.createTable({
        title: "Default Table",
        callbacks : myCallback
    }, function(client, result, done) {
        utils.inspectCallback(client, Object.assign({}, myCallback), JSONfn.parse(result.callbackResult));
        done();
    }, true)
);