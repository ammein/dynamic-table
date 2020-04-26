const steps = require('apostrophe-nightwatch-tools/steps');
let counter = 0;
module.exports = (tableTitle, all = true) => {
    counter++;
    return {
        [`[${counter++}] Delete Widget on target title named '${tableTitle}'`] : function(client) {
            client
                .perform(function(){
                    console.log("****************************");
                    console.log(`
Delete in process...
Delete Option = ${all ? "All Widget" : "One Widget"}
                    `);
                    console.log("****************************");
                })
                .execute(function(tableTitle, all){
                    if (all){
                        Array.prototype.slice.call(document.querySelectorAll(`${tableTitle.length > 0 ? `[data-query*='${tableTitle}']` : "[data-query]"}`)).forEach(function (val) {
                            val.parentElement.parentElement.querySelector("[data-apos-widget-controls] [data-apos-tooltip='Trash']").click()
                        });

                        // Check if all widget has been deleted
                        if (Array.prototype.slice.call(document.querySelectorAll(`${tableTitle.length > 0 ? `[data-query*='${tableTitle}']` : "[data-query]"}`)).length === 0) {
                            return true;
                        }else {
                            return false;
                        }
                    } else {
                        try {
                            document.querySelector(`${tableTitle.length > 0 ? `[data-query*='${tableTitle}']` : "[data-query]"}`).parentElement.parentElement.querySelector("[data-apos-widget-controls] [data-apos-tooltip='Trash']").click()
                        } catch(e) {
                            return false;
                        }

                        return true;
                    }
                }, [tableTitle, all], function(result){
                    client.assert.ok(result.value);
                    if(result.value) {
                        client.commitTable();
                    }
                })
        }
    }
}