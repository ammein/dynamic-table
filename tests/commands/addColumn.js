exports.command = function addColumn(num) {
    var tableTab = '[data-apos-open-group="table"]';
    var columnInput = 'input[name=column]';
    var self = this;
    return self.getAttribute(tableTab, 'class', function (result) {
        if (result.value.match(/apos-active/)) {
            return self
                .setValue(columnInput, num);
        } else {
            return self
                .clickInModal('dynamic-table-editor-modal', tableTab)
                .pause(1000)
                .setValue(columnInput, num);
        }
    })
}