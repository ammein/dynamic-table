let counter = 0;
module.exports = (mainSelector ,pieceName, tableTitle) => {
    counter++;
    return {
        [`[${counter}] Adding New Dynamic Table '${tableTitle}' Widget to '${mainSelector}' selector`]: function (client) {
            const save = '[data-apos-save]';
            const cancel = '[data-apos-cancel]';
            const browseButtonSelector = '[data-apos-browse]';
            const commitModalClass = 'apostrophe-workflow-commit-modal';
            const addContentSelector = `${mainSelector} [data-apos-add-content]`;
            const widgetContentSelector = `${mainSelector} [data-apos-dropdown-items] [data-apos-add-item=${pieceName}]`;
            var click = false;

            client.getLocationInView(mainSelector);
            client.clickWhenReady(addContentSelector);
            client.pause(3000);
            client.clickWhenReady(widgetContentSelector);

            client.waitForModal(`${pieceName}-widgets-editor`);
            client.clickInModal(`${pieceName}-widgets-editor`, browseButtonSelector);

            client.waitForModal(`${pieceName}-manager-modal`);
            var matchRegex = new RegExp(tableTitle, 'g');
            client
                .perform(function(){
                    console.log("Performing click on a selected list via title name='" + tableTitle + "'");
                })
                .execute(function(click, pieceName, matchRegex){
                    Array.prototype.slice.call(document.querySelectorAll(`[data-apos-modal-current='${pieceName}-manager-modal'] [data-list] tr`)).forEach((val, i) => {
                        if (val.textContent.match(matchRegex)) {
                            val.querySelector("td:first-child label").click();
                            click = true;
                        }
                    })

                    if (click === true) {
                        return true;
                    }else {
                        return false;
                    }
                }, [click, pieceName, matchRegex], function(result){
                    client.assert.ok(result.value);
                });

            client.clickInModal(`${pieceName}-manager-modal`, save);
            client.waitForModal(`${pieceName}-widgets-editor`);

            client.clickInModal(`${pieceName}-widgets-editor`, save);

            client.waitForNoModals();
            client.pause(1000);
            client.expect.element(`[data-query*="${tableTitle}"]`).to.be.present;
            client.expect.element(`[data-query*="${tableTitle}"]`).to.be.visible;
            client.getLocationInView('css selector', `[data-query*="${tableTitle}"]`);
            client.categoryScreenshot(`Table Widget (${tableTitle}).png`);
            client.commitTable();
        }
    }
}