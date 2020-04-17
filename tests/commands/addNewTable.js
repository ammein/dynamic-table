exports.command = function addNewTable(){
    return this
            .clickInModal('dynamic-table-manager-modal', '[data-apos-create-dynamic-tables]')
            .waitForModal('dynamic-table-editor-modal');
}