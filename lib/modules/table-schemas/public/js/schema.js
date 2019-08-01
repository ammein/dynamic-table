apos.define("apostrophe-schemas",{
    construct : function(self,options){
        // Add click handlers for group tabs
        self.enableGroupTabs = function ($el) {
            debugger;
            $el.on('click', '[data-apos-open-group]', function () {
                var $tab = $(this);
                $el.find('[data-apos-open-group],[data-apos-group]').removeClass('apos-active');
                $tab.addClass('apos-active');
                $el.find('[data-apos-group="' + $tab.data('apos-open-group') + '"]').addClass('apos-active');
                return false;
            });
        };
    }
})