apos.define("apostrophe-schemas",{
    construct : function(self,options){

        // Save in new object dt (DataTablesJS)
        self.dt = {}

        self.dt.rebuildDataTables = function(val){

            if (apos.assets.options.lean){
                // Destroy first
                if (self.dt.vanillaJSTable){
                    if (!self.dt.settings.ajax && self.dt.vanillaJSTable.options.ajax) {
                        delete self.dt.vanillaJSTable.options.ajax;
                        delete self.dt.vanillaJSTable.options.load;
                        delete self.dt.vanillaJSTable.options.content;
                    }
                    // Always delete data and clear datatables
                    delete self.dt.vanillaJSTable.options.data;
                    self.dt.vanillaJSTable.clear()
                    self.dt.vanillaJSTable.destroy()
                    delete self.dt.vanillaJSTable;
                }

                // Always convert
                if(self.dt.settings.data && self.dt.settings.columns){
                    var data = self.dt.settings.data;
                    var columns = self.dt.settings.columns;

                    var obj = {
                        headings: [],
                        data: data
                    };

                    obj.headings = columns.reduce(function (init, next, i, arr) {
                        return init.concat(next.title);
                    }, []);
                }

                // Empty the table to reinitialization
                $(val).empty()

                // Append the table clone node
                $(val).append(self.dt.getTable.cloneNode());

                self.dt.vanillaJSTable = new simpleDatatables.DataTable(val.querySelector("#dynamicTable"), self.dt.settings.ajax ? self.dt.settings : {
                    data: obj
                });

                // Apply Event
                apos.dynamicTableWidgetsEditor.registerTableEvent(self.dt.vanillaJSTable);
            }else{
                // If the table use DataTablesJS, destroy it first
                if ($.fn.DataTable.isDataTable($(val).find("#dynamicTable"))) {
                    $(val).find("#dynamicTable").DataTable().clear().destroy();
                }

                // Delete additional data on options when initialized
                delete self.dt.settings.aaData
                delete self.dt.settings.aoColumns;

                // Empty the table to reinitialization
                $(val).empty()

                // Append the table clone node
                $(val).append(self.dt.getTable.cloneNode());
                try {
                    // Try if success
                    $(val).find("#dynamicTable").DataTable(self.dt.settings);

                    // Apply Event
                    apos.dynamicTableWidgetsEditor.registerTableEvent($(val).find("#dynamicTable"));
                } catch (e) {
                    // If not, destroy it ! It will output a console error and the table won't even respond
                    // on change input for row & column
                    $(val).find("#dynamicTable").DataTable().clear();
                    // Just remove dataTable class
                    $(val).find("#dynamicTable").removeClass("dataTable");
                }
            }
        }

        function runTabs($el , $tab){
            if($el.find(".dynamic-table-area").length > 0){
                // Grab Settings first and merge if necessary
                Object.assign(self.dt.settings, apos.dynamicTableWidgetsEditor.EditorDataTableOptions);
            }
            $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
            $tab.addClass('apos-active');
            $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
            $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // This will be everything that will be removed from switching 
                if (val.offsetParent !== null) {
                    self.dt.rebuildDataTables(val);
                }
            })

            if($el.find(".dynamic-table-area").length > 0){
                // Dynamic Auto Resize Textarea
                apos.dynamicTableWidgetsEditor.schema.forEach(function (value, i, arr) {
                    var field = apos.schemas.findField($el, value.name).get(0);
                    if (field.type === "textarea" && field.offsetParent !== null){
                        apos.dynamicTableWidgetsEditor.executeAutoResize(field)
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