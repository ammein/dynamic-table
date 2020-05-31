const path = require("path");
const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const mySteps = require('../steps');
const JSONfn = require('jsonfn').JSONfn;
const utils = require('../utils');
let myOptions = {
    autoColumns: true
}
module.exports = Object.assign({
        before: (client, done) => {
            const {
                apos_address,
                apos_port
            } = client.globals;
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
        title: "Load CSV Table",
        options: myOptions
    }, function (client, result, done) {
        console.log(result.optionsResult);
        utils.inspectOptions(client, myOptions, result.optionsResult);
        done();
    })
);