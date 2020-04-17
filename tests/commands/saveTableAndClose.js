exports.command = function saveTableAndClose() {
    var workflowButton = '[data-apos-dropdown-name="workflow"]';
    var commitButton = '[data-apos-workflow-commit]';
    var saveButton = '[data-apos-save]';
    var cancelButton = '[data-apos-cancel]';
    return this
            .clickInModal('dynamic-table-editor-modal', workflowButton)
            .clickInModal('dynamic-table-editor-modal', commitButton)
            .clickInModal('apostrophe-workflow-commit-modal', saveButton)
            .clickInModal('dynamic-table-manager-modal', cancelButton)
            .waitForNoModals();
}