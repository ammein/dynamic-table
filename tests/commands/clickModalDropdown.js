exports.command = function clickModalDropdown(modalName, dropdownName, buttonNameToClick) {
    return this
        .waitForModal(modalName)
        .clickInModal(modalName, `[data-apos-dropdown-name="${dropdownName}"]`)
        .clickInModal(modalName, buttonNameToClick)
}