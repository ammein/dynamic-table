exports.command = function openDynamicTable(){
    return this
            .openAdminBarItem('dynamic-table')
            .waitForModal('dynamic-table-manager-modal');
}