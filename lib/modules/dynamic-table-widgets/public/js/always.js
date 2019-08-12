apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        self.play = function($widget, data, options){
            // Always set data based on saves piece
            // self.setData($widget, data.dynamicTableId);
            var table = $widget.find("table#" + data._id);
            var DataTableOptions = data.data && data.data.length > 0 ? JSON.parse(data.data) : undefined;
            var DataTableAjaxOptions = data.ajaxOptions && data.ajaxOptions.length > 0 ? JSON.parse(data.ajaxOptions) : undefined;

            table.DataTable(DataTableOptions || DataTableAjaxOptions);
            console.log(data,options);
        }        
    }
})