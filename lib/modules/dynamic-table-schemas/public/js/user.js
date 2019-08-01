apos.define("apostrophe-schemas",{
    construct : function(self,options){
        // Add click handlers for group tabs
        var superAfterPopulate = self.afterPopulate;

        self.hideTable = function (table) {
            table.css("display" , "none");
            return;
        }

        self.showTable = function (table) {
            table.css("display" , "");
            return;
        }

        self.afterPopulate = function ($el, schema, object, callback){
            var $tab = $el.find("[data-apos-open-group]");
            $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
                debugger;
                if (i === 0) {
                    self.showTable($(val));
                }else{
                    self.hideTable($(val));
                }
            })

            return superAfterPopulate($el, schema, object, callback)
        }

        self.enableGroupTabs = function ($el) {
            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
                $tab.addClass('apos-active');
                $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
                $el.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
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