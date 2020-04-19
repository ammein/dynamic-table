let counter = 0;
module.exports = (mainSelector ,pieceName, tableTitle) => {
    counter++;
    return {
        [`[${counter}] Adding New Dynamic Table '${tableTitle}' Widget to '${mainSelector}' selector`]: function (client) {
            const save = '[data-apos-save]';
            const cancel = '[data-apos-cancel]';
            const browseButtonSelector = '[data-apos-browse]';
            const commitModalClass = 'apostrophe-workflow-commit-modal';
            const addContentSelector = `${mainSelector} [data-apos-add-content]`;
            const widgetContentSelector = `${mainSelector} [data-apos-dropdown-items] [data-apos-add-item=${pieceName}]`;

            client.getLocationInView(mainSelector);
            client.clickWhenReady(addContentSelector);
            client.pause(3000);
            client.clickWhenReady(widgetContentSelector);

            client.waitForModal(`${pieceName}-widgets-editor`);
            client.clickInModal(`${pieceName}-widgets-editor`, browseButtonSelector);

            client.waitForModal(`${pieceName}-manager-modal`);
            client.clickInModal(`${pieceName}-manager-modal`, '[data-apos-manage-view] [data-piece]:first-child label');

            client.clickInModal(`${pieceName}-manager-modal`, save);
            client.waitForModal(`${pieceName}-widgets-editor`);

            client.clickInModal(`${pieceName}-widgets-editor`, save);

            client.waitForNoModals();
        }
    }
}