apos.define("apostrophe-schemas",{
    construct : function(self,options){

        var superBeforePopulate = self.beforePopulate;
        var superAfterPopulate = self.afterPopulate;

        self.beforePopulate = function ($el, schema, object, callback){
            if ($el.find(".dynamic-table-area").length > 0) {
                // Reset EditorDataTableOptions
                delete apos.dynamicTableUtils.EditorDataTableOptions;
                // Re-initialize EditorDataTableOptions
                apos.dynamicTableUtils.mergeOptions();
                self.dt.dynamicSchema = []
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
                self.dt.dynamicSchema = schema;
            }
            return superAfterPopulate($el, schema, object, callback);
        }

        // Save in new object dt (DataTablesJS)
        self.dt = {}

        function runTabs($el , $tab){
            if($el.find(".dynamic-table-area").length > 0){
                // Grab Settings first and merge if necessary
                Object.assign(self.dt.settings, apos.dynamicTableUtils.EditorDataTableOptions);
            }
            $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
            $tab.addClass('apos-active');
            $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
            $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // This will be everything that will be removed from switching 
                if (val.offsetParent !== null) {
                    apos.dynamicTableUtils.$form = $el;
                    apos.dynamicTableUtils.destroyTable();
                    apos.dynamicTableUtils.initTable();
                }
            })

            if($el.find(".dynamic-table-area").length > 0){
                // Dynamic Auto Resize Textarea
                self.dt.dynamicSchema.forEach(function (value, i, arr) {
                    var field = apos.schemas.findField($el, value.name).get(0);
                    if (value.textarea && field.offsetParent !== null){
                        apos.dynamicTableUtils.executeAutoResize(field)
                        apos.dynamicTableUtils.textareaAutoResize(field)
                    }
                })
            }
        }

        // Override Group Tabs. Due to all grouping available in the form that will display many tables each
        // We are going to override it and reinitialize if necessary when tab switching event is clicked
        // Bug were fixed from UI Breakout using DataTablesJS
        self.enableGroupTabs = function ($el) {

            // Grab Original Table. Only happen once
            $el.find(':not([data-apos-group="' + $el.find("[data-apos-open-group]").data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // Clone it to append new node when tab switching
                self.dt.getTable = val.querySelector("#dynamicTable").cloneNode();
            })

            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                self.dt.settings = {};

                runTabs($el, $tab);

                return false;
            });
        };

    }
})