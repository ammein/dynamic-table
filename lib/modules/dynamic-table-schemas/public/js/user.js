apos.define("apostrophe-schemas",{
    construct : function(self,options){
        // Add click handlers for group tabs

        self.initTable = function (table) {
            if ($.fn.DataTable.isDataTable(table)) {
                // Get Initial Settings
                self.tableSettings = table.dataTable().api().init();
                // Destroy Table to restart
                table.DataTable().clear().destroy();
                // Delete additional data on options when initialized
                delete self.tableSettings.aaData
                delete self.tableSettings.aoColumns;
                // Empty the table to reinitialization
                table.empty();
                table.DataTable(self.tableSettings);
                return;
            }

            table.DataTable(self.tableSettings);
            return;
        }

        self.destroyTable = function (table) {
            table.DataTable().clear().destroy();
            table.empty();

            delete self.tableSettings.aaData
            delete self.tableSettings.aoColumns;
            delete self.tableSettings.data
            delete self.tableSettings.columns;
            return;
        }

        self.enableGroupTabs = function ($el) {
            debugger;
            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
                $tab.addClass('apos-active');
                $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find("#dynamicTable").each(function (i, val, arr) {
                    if(val.offsetParent === null){
                        self.initTable($(val));
                    }
                    self.destroyTable($(val));
                })
                $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
                return false;
            });
        };
    }
})