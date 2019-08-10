apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        self.play = function($widget, data, options){
            // Always set data based on saves piece
            self.setData($widget, data.dynamicTableId);
            var table = $widget.find("table#" + data._id);
            console.log(data,options);
        }
        
    }
})