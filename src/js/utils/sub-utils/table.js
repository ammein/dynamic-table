let table = function(self, options) {
    self.initTable = function () {
        if (self.tabulator.table) {
            // Clear Data and setData again
            self.tabulator.table.clearData();
            self.tabulator.table.setData(self.rowsAndColumns);
        } else {
            // Refresh Existing Table
            self.$tableHTML = self.$form.find('table#dynamicTable');

            // Safe method. Table may display many
            self.$tableHTML.each(function (i, val) {
                // When table is visible
                if (val.offsetParent !== null) {
                    // If Ajax enable, disable custom row and column data
                    let table = null
                    if (
                        self.tabulator.options.ajaxURL &&
                        self.rowData.length === 0 &&
                        self.columnData.length === 0
                    ) {
                        // eslint-disable-next-line no-undef
                        table = new Tabulator(self.$tableHTML[i], self.tabulator.options);
                        self.tabulator.table = table;
                    } else {
                        if (self.tabulator.options.ajaxURL) {
                            self.resetAjaxTable();
                            self.resetAjaxOptions();
                        }
                        // eslint-disable-next-line no-undef
                        table = new Tabulator(self.$tableHTML[i], Object.assign({}, self.tabulator.options, {
                            columns: self.columnData
                        }));

                        self.tabulator.table = table;
                        table.setData(self.rowsAndColumns);
                    }
                }
            });
        }

        // Register any DataTablesJS Event
        self.registerTableEvent(self.tabulator.table);

        // For Schema Auto Insert
        if (self.rowData.length !== 0 && self.columnData.length !== 0) {
            self.convertData()
        }
    }

    self.destroyTable = function () {
        // Reset options
        self.resetDataOptions();

        if (self.tabulator.table) {
            let parentTable = self.tabulator.table.element.parentElement;
            self.tabulator.table.destroy();
            self.tabulator.table = null;
            $(parentTable).empty();
            $(parentTable).append(apos.schemas.tabulator.getTable.cloneNode());
        }

        // Refresh Existing Table
        self.$tableHTML = self.$form.find('table#dynamicTable');
    }

    // Ajax Begins
    self.executeAjax = function (options) {
        let mergeOptions = Object.assign({}, self.tabulator.options, typeof options !== 'string' ? options : {});
        if (self.tabulator.table) {
            self.destroyTable();
        }

        // Reset Data
        self.rowData = [];
        self.columnData = [];
        if (options !== (null || undefined)) {
            self.tabulator.options = Object.assign({}, {
                ajaxURL: typeof options === 'string' ? options : options.ajaxURL
            }, mergeOptions)
        }
        self.resetCustomTable();
        self.initTable();
    }

    self.resetAjaxOptions = function () {
        delete self.tabulator.options.ajaxURL;
    }

    self.reloadTable = function() {
        self.restartTable(self.tabulator.options);
    }

    self.restartTable = function (options) {
        // Restart Table
        if (self.tabulator.options.ajaxURL) {
            // If Ajax enabled, use executeAjax function
            self.executeAjax(options || self.tabulator.options)
        } else {
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxOptions();
                self.resetAjaxTable();
            }
            if (options) {
                self.tabulator.options = Object.assign({}, self.tabulator.options, options);
            }
            // Restart normal custom table
            self.initTable();
        }
    }
}

export default table;