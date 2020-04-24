/* global FileReader, Papa */
let load = function (self, options) {
    self.readFile = function (accept, convertData = false) {
        return new Promise(function (resolve, reject) {
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = accept || '.json,application/json';
            fileInput.addEventListener('change', function (t) {
                let result;
                let r = fileInput.files[0];
                let filereader = new FileReader();
                filereader.readAsText(r);
                filereader.onload = function (t) {
                    try {
                        if (accept === '.json,application/json') {
                            result = JSON.parse(filereader.result);
                            return resolve(result);
                        } else {
                            result = filereader.result;
                            if (convertData) {
                                return Papa.parse(result, {
                                    worker: true,
                                    complete: function (papaResults, file) {
                                        return resolve(papaResults.data);
                                    },
                                    error: function (error, file) {
                                        return apos.utils.warn('Unable to parse file: ' + file + '\n', error) && void reject(error);
                                    }
                                });
                            }
                            return resolve(result);
                        }
                    } catch (t) {
                        return apos.utils.warn('File Load Error - File contents is invalid JSON', t) && void reject(t)
                    }
                };
                filereader.onerror = function (t) {
                    apos.utils.warn('File Load Error - Unable to read file');
                    reject(t);
                }
            });
            fileInput.click()
        })
    }

    self.toTabulatorData = function (data) {
        let columnData = [];
        let rowData = [];
        for (let a = 0; a < data.length; a++) {
            if (a === 0) {
                for (let b = 0; b < data[a].length; b++) {
                    columnData.push({
                        title: data[a][b],
                        field: apos.utils.camelName(data[a][b])
                    })
                }
                continue;
            } else {
                rowData.push(data[a]);
            }
        }
        return {
            columns: columnData,
            data: rowData
        }
    }

    self.loadJSON = function() {
        if (!self.tabulator.table) {
            self.initTable();
        }
        self.tabulator.table.setDataFromLocalFile().then(() => {
            self.resetCustomTable();
            self.updateRowsAndColumns(self.getTableData());
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            self.hardReloadTable(Object.assign({}, {
                autoColumns: false
            }));
            self.convertData();
        }).catch((e) => {
            apos.utils.warn(e);
        });
    }

    self.loadTxt = function() {
        if (!self.tabulator.table) {
            self.initTable();
        }
        self.tabulator.table.setDataFromLocalFile('.txt').then(() => {
            self.resetCustomTable();
            self.updateRowsAndColumns(self.getTableData());
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            self.hardReloadTable(Object.assign({}, {
                autoColumns: false
            }));
            self.convertData();
        }).catch((e) => {
            apos.utils.warn(e);
        });
    }

    self.loadCSV = function() {
        if (!self.tabulator.table) {
            self.initTable();
        }

        self.readFile('.csv', true)
        .then((data) => {
            let getData = self.toTabulatorData(data);
            return getData;
        })
        .then((convertData) => {
            self.resetCustomTable();
            self.resetDataOptions();
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            self.updateRowsAndColumns(convertData)
            self.hardReloadTable(Object.assign({}, convertData, {
                autoColumns: false
            }));
            self.convertData();
        })
        .catch((e) => {
            apos.utils.warn(e);
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
            .map(val => {
                let columns = self.tabulator.table.getColumnDefinitions();
                for (let key in columns) {
                    if (columns.hasOwnProperty(key)) {
                        if (val === columns[key].field) {
                            return columns[key];
                        }
                    }
                }
            })

        return {
            data: tableData,
            columns: columns
        }
    }
}

export default load;