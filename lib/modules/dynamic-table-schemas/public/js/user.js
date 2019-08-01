apos.define("apostrophe-schemas",{
    construct : function(self,options){
        // Add click handlers for group tabs
        var superBeforePopulate = self.beforePopulate;

        self.hideTable = function (table) {
            table.css("display" , "none");
        }

        self.showTable = function (table) {
            table.css("display" , "");
            return;
        }

        self.beforePopulate = function ($el, schema, object, callback){
            var $tab = $el.find("[data-apos-open-group]");
            $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find("#dynamicTable").each(function (i, val, arr) {
                if (i === 0) {
                    self.showTable($(val));
                    continue;
                }
                self.hideTable($(val));
            })

            return superBeforePopulate($el, schema, object, callback)
        }

        self.enableGroupTabs = function ($el) {
            debugger;
            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
                $tab.addClass('apos-active');
                $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
                $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find("#dynamicTable").each(function (i, val, arr) {
                    if (val.offsetParent === null) {
                        self.hideTable($(val));
                    }
                    self.showTable($(val));
                })
                return false;
            });
        };
    }
})