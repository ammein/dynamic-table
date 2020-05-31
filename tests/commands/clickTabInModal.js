exports.command = function clickTabInModal(modalName, tabName) {
    var tabNameReg = new RegExp(tabName, "g");
    return this
        .execute(function (modalName, tabNameReg) {
            var callbackTab = Array.prototype.slice.call(document.querySelectorAll("[data-apos-modal-current='" + modalName + "'] [data-apos-form] .apos-schema-tabs div")).filter((val, i, arr) => {
                return val.textContent.match(tabNameReg)
            })[0];

            if (callbackTab.className.match(/apos-active/g)) {
                return true;
            } else {
                callbackTab.click();
                return true;
            }
        }, [modalName, tabNameReg], function (result) {
            console.log("Tabulator Callback Tab for '" + tabName + "' in '" + modalName + "' is active");
        })
}