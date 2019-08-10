apos.define("dynamic-table-widgets", {
    extend : "apostrophe-widgets",
    construct:function(self,options){
        var superStartAutosavingAreaThen = self.startAutosavingAreaThen;
        self.play = function($widget, data, options){
            
            var table = $widget.find("table#" + data._id);
            console.log(data,options);

            self.startAutosavingAreaThen = function ($widget, fn) {
                return superStartAutosavingAreaThen($widget, function () {
                    var isWidgetEmpty = self.isEmpty($widget);

                    debugger;
                })
            }
        }
        
    }
})