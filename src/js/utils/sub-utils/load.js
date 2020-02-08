let load = function (self, options) {
    self.loadJSON = function() {
        self.tabulator.table.setDataFromLocalFile().then(() => {
            self.updateRowsAndColumns(self.getTableData());
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            self.restartTable();
            self.convertData();
        }).catch((e) => {
            console.warn(e);
        });
    }

    self.loadTxt = function() {
        self.tabulator.table.setDataFromLocalFile('.txt').then(() => {
            self.updateRowsAndColumns(self.getTableData());
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            self.restartTable();
            self.convertData();
        }).catch((e) => {
            console.warn(e);
        });
    }

    self.getTableData = function() {
        let tableData = self.tabulator.table.getData()
            .map(val => Object.getOwnPropertyNames(val).map(key => val[key]))
        let columns = self.tabulator.table.getData()
            // Get the keys
            .map((igKey, i) => Object.getOwnPropertyNames(igKey))
            // Only merge that is unique array value
            .reduce((init, next) => init = _.union(next), [])
            // Produce array of object
            .map(val => val = { title: val })

        return {
            data: tableData,
            columns: columns
        }
    }
}

export default load;