exports.command = function checkboxInModal(modalName, groupName, checkboxName, callback) {
    var checkbox = "input[name=\"" + groupName + "\"][value=\"" + checkboxName + "\"]";
    return this
        .waitForElementReady(`[data-apos-modal-current='${modalName}'] ${checkbox}`)
        .execute(function (modalName, checkbox) {
            var checked = document.querySelector(`[data-apos-modal-current='${modalName}'] ${checkbox}`).checked;

            if (checked) {
                return false;
            } else {
                return true;
            }
        }, [modalName, checkbox], callback)
}