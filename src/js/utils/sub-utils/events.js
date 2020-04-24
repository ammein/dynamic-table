let events = function(self, options) {
    self.allListener = function () {
        apos.on('widgetTrashed', function ($widget) {
            if ($widget.data() && $widget.data().aposWidget === 'dynamic-table') {
                let pieceId = apos.modules['dynamic-table-widgets'].getData($widget).dynamicTableId;
                self.removeUrlsApi({
                    id: pieceId,
                    url: window.location.pathname
                }, function (err) {
                    if (err) {
                        return apos.utils.warn('Unable to remove widget location.');
                    }
                    // Delete Browser widget options table
                    if (apos.dynamicTableWidget) {
                        delete apos.dynamicTableWidget.tabulator[pieceId];
                    } else if (apos.dynamicTableLean) {
                        delete apos.dynamicTableLean[pieceId];
                    }
                    return apos.utils.log('Successful remove widget location.');
                })
            }
        })
    }

    // Any table event is allowed
    self.registerTableEvent = function ($table) {

    }
}

export default events;