apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        self.play = function($widget, data, options){
            var table;
            // Always set data based on saves piece
            // self.setData($widget, data.dynamicTableId);
            table = $widget.find("table#" + data._id);
            var cloneTable = table.clone();
            var parent = table.parent();
            parent.empty();
            parent.append(cloneTable)
            var DataTableOptions = data.data && data.data.length > 0 ? JSON.parse(data.data) : undefined;
            var DataTableAjaxOptions = data.ajaxOptions && data.ajaxOptions.length > 0 ? JSON.parse(data.ajaxOptions) : undefined;
            table = parent.find("table#" + data._id);
            table.DataTable(DataTableOptions || DataTableAjaxOptions);
            console.log(data,options);
        }        
    }
})