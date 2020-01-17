apos.define('apostrophe-pieces-manager-modal', {
    construct: function(self,options) {
        var superBeforeShow = self.beforeShow;

        self.beforeShow = function(callback) {
            return superBeforeShow(function(err) {
                if (err) {
                    return callback(err)
                }
                
                if (self.options.name === "dynamic-tables") {
                    apos.dynamicTableUtils.tabulator.schemas = self.options.schema;
                }

                return callback(null);
            })
        }
    }
})