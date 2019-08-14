apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){

        self.getResult = function(query, callback) {
            $.get('/modules/dynamic-table/get-fields', query, function (result) {
                if (result.status === "error") {
                    return callback(result.message);
                }
                return callback(null, result.message);
            })
        }

        self.play = function($widget, data, options){
            var table;
            // Always set data based on saves piece
            // self.setData($widget, data.dynamicTableId);
            table = $widget.find("table#" + data._id);
            var cloneTable = table.clone();
            var parent = table.parent();
            parent.empty();
            parent.append(cloneTable);

            self.getResult({ id: data.dynamicTableId } , function(err,result){
                if(err){
                    return apos.notify("ERROR : " + err)
                }

                try {
                    var DataTableOptions = result.data && result.data.length > 0 ? JSON5.parse(result.data) : undefined;
                } catch (e) {
                    apos.utils.warn("Error when parsing options, are you sure your option is properly configured ? \n\n" + e)
                }
                try {
                    var DataTableAjaxOptions = result.ajaxOptions && result.ajaxOptions.length > 0 ? JSON5.parse(result.ajaxOptions) : undefined;                    
                } catch (error) {
                    apos.utils.warn("Error when parsing options, are you sure your option is properly configured ? \n\n" + e)
                }

                table = parent.find("table#" + data._id);
                table.DataTable(DataTableOptions || DataTableAjaxOptions);
            })
        }        
    }
})