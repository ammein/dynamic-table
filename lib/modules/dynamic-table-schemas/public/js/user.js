apos.define("apostrophe-schemas",{
    construct : function(self,options){
        // Add click handlers for group tabs
        var superShowGroupContaining = self.showGroupContaining;

        self.hideTable = function (table) {
            table.css("display" , "none");
            return;
        }

        self.showTable = function (table) {
            table.css("display" , "");
            return;
        }

        self.showGroupContaining = function($element){
            // superShowGroupContaining($element);

            // var $group = $element.closest('.apos-schema-group');

            // // If group presents
            // if ($group.length) {
            //     if (!$group.hasClass('apos-active')) {
            //         debugger;
            //     }
            // }
            // var $tab = $element.find("[data-apos-open-group]");
            // $element.find(':not([data-apos-group="' + $tab.data('apos-open-group') + '"])').find(".dynamic-table-area").each(function (i, val, arr) {
            //     debugger;
            //     if (i === 0) {
            //         self.showTable($(val));
            //     } else {
            //         self.hideTable($(val));
            //     }
            // })
        }
    }
})