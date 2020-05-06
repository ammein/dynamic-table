exports.command = function editTable(tableName) {
    var self = this;
    var matchRegex = new RegExp(tableName, 'g');
    var id = "";
    return self
            .waitForModal('dynamic-table-manager-modal')
            .execute(function(tableName, matchRegex) {
                    var click = false;
                    var pieceId = "";
                    Array.prototype.slice.call(document.querySelectorAll(`[data-apos-modal-current='dynamic-table-manager-modal'] [data-list] tr`)).forEach((val, i) => {
                        if (val.textContent.match(matchRegex) && val.textContent.match(matchRegex).length > 0) {
                            pieceId = val.getAttribute('data-piece');
                            // document.querySelector('[data-apos-modal-current="dynamic-table-manager-modal"] [data-piece="' + pieceId + '"] td:nth-child(2) a[data-apos-edit-dynamic-tables="' + pieceId + '"]').click();
                            click = true;
                            return;
                        }
                    })

                    if(click) {
                        return {
                            success: true,
                            id: pieceId
                        }
                    } else {
                        return {
                            success: false,
                            id: pieceId
                        }
                    }
            }, [tableName, matchRegex], function(result) {
                self.assert.ok(result.value.success);
                console.log('Id: ', result.value.id)
                id = result.value.id;
                self.clickInModal('dynamic-table-manager-modal', '[data-piece="' + result.value.id + '"] td:nth-child(2) a[data-apos-edit-dynamic-tables="' + result.value.id + '"]');
            })
            .waitForModal('dynamic-table-editor-modal')
}