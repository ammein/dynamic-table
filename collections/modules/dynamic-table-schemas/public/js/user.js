apos.define("apostrophe-schemas",{
    construct : function(self,options){

        var superBeforePopulate = self.beforePopulate;
        var superAfterPopulate = self.afterPopulate;
        var superEnableGroupTabs = self.enableGroupTabs;

        self.beforePopulate = function ($el, schema, object, callback){
            if ($el.find(".dynamic-table-area").length > 0) {
                // Reset EditorDataTableOptions
                apos.dynamicTableUtils.resetDataOptions();
                self.tabulator.schema = []
            }
            return superBeforePopulate($el , schema , object, callback);
        }

        self.afterPopulate = function ($el, schema, object, callback){
            if ($el.find(".dynamic-table-area").length > 0) {
                // Recreate dynamic-table-utils
                apos.create("dynamic-table-utils", {
                    schemas: schema,
                    object: object
                });
                self.tabulator.schema = schema;
            }
            return superAfterPopulate($el, schema, object, callback);
        }

        // Save in new object dt (DataTablesJS)
        self.tabulator = {}

        // Extends Group Tabs. Due to all grouping available in the form that will display many tables each
        // We are going to extend it and reinitialize if necessary when tab switching event is clicked
        self.enableGroupTabs = function ($el) {

            superEnableGroupTabs($el)

            // Grab Original Table. Only happen once
            $el.find(':not([data-apos-group="' + $el.find("[data-apos-open-group]").data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // Clone it to append new node when tab switching
                self.tabulator.getTable = val.querySelector("#dynamicTable").cloneNode();
            })

            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                self.tabulator.settings = {};

                $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                    // This will be everything that will be removed from switching 
                    if (val.offsetParent !== null) {
                        // Remove Childrens Javascript
                        if (jQuery || $) {
                            $(val).empty();
                        } else {
                            for (var i = 0; i <= val.childNodes.length; i++) {
                                val.removeChild(val.childNodes[i]);
                            }
                        }
                        // Append New Table
                        val.appendChild(apos.schemas.tabulator.getTable)
                        apos.dynamicTableUtils.changeTabRebuildTable(val, $tab);
                    }
                })

                if ($el.find(".dynamic-table-area").length > 0) {
                    // Dynamic Auto Resize Textarea
                    self.tabulator.schema.forEach(function (value, i, arr) {
                        var field = apos.schemas.findField($el, value.name).get(0);
                        if (value.textarea && field.offsetParent !== null) {
                            apos.dynamicTableUtils.executeAutoResize(field)
                            apos.dynamicTableUtils.textareaAutoResize(field)
                        }
                    })
                }

                return false;
            });
        };

    }
})