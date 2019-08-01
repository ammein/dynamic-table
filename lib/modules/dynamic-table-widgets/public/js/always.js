apos.define("table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        self.play = function($widget, data, options){
            
            var table = $widget.find("table");
            console.log(data,options);
        }
    }
})