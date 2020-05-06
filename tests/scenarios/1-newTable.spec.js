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
    mySteps.createTable({
        title: "Default Table",
        row: 3,
        column: 2
    }, function(client, data, done) { 
        console.log("Data Result: \n", JSON.parse(data));
        client.assert.ok(typeof data === "string");
        // Checking Data on Tabulator to be the same as value on input field
        client
            .perform(function () {
                console.log("Checking Data on Tabulator to be the same with value on input[name='data'] field");
            })
            .execute(function(data){
                return JSONfn.stringify(apos.dynamicTableUtils.getTableData()) === JSONfn.stringify(JSONfn.parse(data))
            }, [data], function(result){
                client.assert.ok(result.value);
            })
        done();
    })
);