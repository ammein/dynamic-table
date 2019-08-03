apos.define("apostrophe-schemas",{
    construct : function(self,options){

        self.dt = {
            ajaxComplete : false
        }

        function runTabs($el , $tab, settings){
            $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
            $tab.addClass('apos-active');
            $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
            $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // This will be everything that will be removed from switching 
                if (val.offsetParent !== null) {

                    // If the table use DataTablesJS, destroy it first
                    if ($.fn.DataTable.isDataTable($(val).find("#dynamicTable"))) {
                        $(val).find("#dynamicTable").DataTable().clear().destroy();
                    }

                    // Delete additional data on options when initialized
                    delete settings.aaData
                    delete settings.aoColumns;

                    // Empty the table to reinitialization
                    $(val).empty()

                    // Append the table clone node
                    $(val).append(getTable.cloneNode());

                    // Get all Table Options Merge
                    var allData = new $.fn.DataTable.Api($(val).parents(':not([data-apos-group="' + $(this).data('apos-open-group') + '"])').find("table#dynamicTable")).data();

                    // Reinitialize , user won't see the magic in the backend that needed to fix this bug ;)
                    if (allData.length > 0) {
                        $(val).find("#dynamicTable").DataTable(settings);
                    }
                }
            })
        }

        // Override Group Tabs. Due to all grouping available in the form that will display many tables each
        // We are going to override it and reinitialize if necessary when tab switching event is clicked
        // Bug were fixed from UI Breakout using DataTablesJS
        self.enableGroupTabs = function ($el) {
            var getTable;

            // Grab Original Table
            $el.find(':not([data-apos-group="' + $el.find("[data-apos-open-group]").data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                // Clone it to append new node when tab switching
                getTable = val.querySelector("#dynamicTable").cloneNode();

                $(val).find("#dynamicTable").on("xhr.dt", function (e, settings, json) {
                    if (json) {
                        self.dt.ajaxComplete = true;
                    }
                })

                $(val).find("#dynamicTable").on("preXhr.dt", function (e, settings, json) {
                    if (json) {
                        self.dt.ajaxComplete = false;
                    }
                })
            })

            var interval = null;

            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                var settings = {};

                // Grab Settings first and merge if necessary
                $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                    Object.assign(settings, new $.fn.DataTable.Api($(val).find("#dynamicTable")).init());
                })

                if(settings.ajax){
                    // Due to ajax, we have to wait until full ajax request completed
                    interval = setInterval(() => {
                        if(self.dt.ajaxComplete){
                            runTabs($el, $tab, settings);
                            clearInterval(interval)
                        }
                    }, 1000);
                }else{
                    runTabs($el, $tab , settings);
                }

                return false;
            });
        };

    }
})