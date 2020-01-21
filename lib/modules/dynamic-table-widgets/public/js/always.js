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

        self.initTable = function(data) {
            // let table = null
            // if (
            //     data.ajaxURL &&
            //     data.data.length === 0 &&
            //     self.columnData.length === 0
            // ) {
            //     // eslint-disable-next-line no-undef
            //     table = new Tabulator(self.$tableHTML[i], self.tabulator.options);
            //     self.tabulator.table = table;
            // } else {
            //     if (self.tabulator.options.ajaxURL) {
            //         self.resetAjaxTable();
            //     }
            //     // eslint-disable-next-line no-undef
            //     table = new Tabulator(self.$tableHTML[i], Object.assign({}, self.tabulator.options, {
            //         columns: self.columnData
            //     }));

            //     self.tabulator.table = table;
            //     table.setData(self.rowsAndColumns);
            // }
        }

        self.getResultAndInitTable = function (ajaxResult) {
            // Loop ajaxResult object
            for (let property of Object.keys(ajaxResult)) {
                if (ajaxResult.hasOwnProperty(property)) {
                    switch (true) {
                        case property === 'ajaxURL' && ajaxResult[property].length > 0:
                            try {
                                self.executeAjax(ajaxResult[property])
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Ajax Table', e);
                            }
                            break;

                        case property === 'data' && ajaxResult[property].length > 0:
                            try {
                                self.updateRowsAndColumns(JSON5.parse(ajaxResult[property]));
                                if (self.tabulator.table) {
                                    self.restartTable();
                                }
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Data Table', e);
                            }
                            break;
                    }
                }
            }
        }

        function getCallbacks() {

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

            return self.getResult({ id: data.dynamicTableId } , function(err,result){
                if(err){
                    return apos.notify("ERROR : " + err)
                }

                return self.initTable(result);
            })
        }        
    }
})