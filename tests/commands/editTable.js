exports.command = function editTable(tableName) {
    var self = this;
    var XSelector = '//a[text()=\'' +tableName + '\']';
    var id = "";
    return self
            .waitForModal('dynamic-table-manager-modal')
            .useXpath()
            .waitForElementReady(XSelector)
            .pause(250)
            .click(XSelector)
            .useCss()
            .waitForModal('dynamic-table-editor-modal')
}