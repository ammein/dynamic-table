// Test Create new table with default options
const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');
const mySteps = require('../steps');
let ajaxURL = "https://jsonplaceholder.typicode.com/posts?id=1&id=2&id=3";

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
    mySteps.createTable({
        title: "Ajax Table",
        ajaxURL: ajaxURL
    }, function(client, result, done) {
        var ajaxResult = [
            {
                userId: 1,
                id: 1,
                title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
            },
            {
                userId: 1,
                id: 2,
                title: "qui est esse",
                body: "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla"
            },
            {
                userId: 1,
                id: 3,
                title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                body: "et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut"
            }
        ];


        // Checking Data on Tabulator to be the same as value on input field
        client
            .perform(function () {
                console.log("Checking Data on Tabulator to be the same expected value.");
                client.pause(5000);
            })
            .execute(function (ajaxResult) {
                return {
                    compare: JSONfn.stringify(apos.dynamicTableUtils.tabulator.table.getData())[0] === JSONfn.stringify(ajaxResult)[0],
                    data: JSONfn.stringify(apos.dynamicTableUtils.tabulator.table.getData()),
                    ajaxResult: JSONfn.stringify(ajaxResult)
                    
                }
            }, [ajaxResult], function(result){
                console.log(result.value);
                client.assert.ok(result.value.compare);
            })
        done();
    })
);