apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        self.play = function($widget, data, options){
            
            var table = $widget.find("table#" + data._id);
            console.log(data,options);
        }
    }
})