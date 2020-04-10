// tests/scenarios/article.spec.js

const server = require('apostrophe-nightwatch-tools/server');
const steps = require('apostrophe-nightwatch-tools/steps');

module.exports = Object.assign(
    {
        before: (client, done) => {
            console.log(process.argv);
            console.log('IN START');
            client.resizeWindow(1200, 800);
            if (!this._server) {
                this._server = server.create('localhost', 4445);
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
    // Execute various steps found in the module
    steps.main(),
    steps.login(),
    // steps.switchLocale('en'),
    // steps.createArticle('New Table'),
    // Execute a custom step
    {
        'Make sure it is working': (client) => {
            // const manageTableRowSelector = 'table[data-items] tr[data-piece]:first-child';
            // const editArticleBtnSelector = `${manageTableRowSelector} .apos-manage-dynamic-table-title a`;
            // const workflowModalBtnSelector =
            //     `[data-apos-dropdown-name="workflow"]`;
            // const submitWorkflowBtnSelector = `[data-apos-workflow-submit]`;

            // // Wait until a modal of the specified type is
            // // the current modal, then click the button to edit the first article
            // client.clickInModal('dynamic-table-manager-modal', editArticleBtnSelector);
            // client.clickInModal('dynamic-table-editor-modal', workflowModalBtnSelector);
            // client.clickInModal('dynamic-table-editor-modal', submitWorkflowBtnSelector);
            // // Wait until a modal of the specified type is the current modal
            // client.waitForModal('dynamic-table-manager-modal');
        }
    }
);