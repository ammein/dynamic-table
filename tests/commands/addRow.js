exports.command = function addRow(num) {
    var tableTab = '[data-apos-open-group="table"]';
    var rowInput = 'input[name=row]';
    var self = this;
    return self.getAttribute(tableTab, 'class', function (result) {
        console.log(result)
        if (result.value.match(/apos-active/)) {
            return self
                .setValue(rowInput, num);
        } else{
            return self
                .clickInModal('dynamic-table-editor-modal', tableTab)
                .pause(1000)
                .setValue(rowInput, num);
        }
    })
}