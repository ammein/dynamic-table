/* global JSON5, JSONfn */
let dataManagement = function(self, options) {
    self.executeRow = function (value) {
        let isNaN = window.isNaN(value);
        let columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');
        if (!isNaN && value !== 0) {
            if (columnInput.length > 0 && columnInput.attr('disabled') === 'disabled') {
                columnInput.attr('disabled', false);
            }

            if (self.rowData.length > 0) {
                self.rowData = self.rowData.slice(0, value)
            }

            // Append Rows
            for (let i = 0; i < value; i++) {
                if (self.rowData[i]) {
                    continue;
                }
                self.rowData.push([]);
            }

            // Trigger change to update value based on active row input
            if (columnInput.length > 0 && columnInput.val().length > 0) {
                apos.schemas.findFieldset(self.$form, 'column').trigger('change');
            }
        }

        if (value === 0) {
            if (columnInput.length > 0) {
                columnInput.attr('disabled', true);
            }
            self.destroyTable();
        }

    }

    self.executeColumn = function (value) {
        let isNaN = window.isNaN(value);
        let rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
        let columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');
        if (!isNaN && value !== 0) {

            if (self.columnData.length > 0) {
                self.columnData = self.columnData.slice(0, value);
            }

            // Loop each row to append new data to it
            for (let a = 0; a < value; a++) {
                if (self.columnData[a]) {
                    continue;
                }

                self.columnData.push({
                    title: 'Header ' + (a + 1),
                    field: 'header' + (a + 1)
                })
            }

            // Reupload data to column change
            for (let row = 0; row < self.rowData.length; row++) {
                for (let column = 0; column < self.columnData.length; column++) {
                    if (self.rowData[row][column]) {
                        continue;
                    }

                    self.rowData[row].push('untitled');
                }
                // Delete unecessary rows data based on columns
                if (self.rowData[row].length !== self.columnData.length) {
                    self.rowData[row] = self.rowData[row].slice(0, self.columnData.length)
                }
            }

            self.updateRowsAndColumns();

            if (self.columnData.length > 0) {
                self.initTable();
            }
        }

        if (value === 0) {
            // Nothing here yet
        }
    }

    self.updateRowsAndColumns = function (object) {
        if (object) {
            self.rowData = object.data;
            self.columnData = object.columns;
            self.executeRow(self.rowData.length);
            self.executeColumn(self.columnData.length);
        }

        self.dataToArrayOfObjects();

        if (self.rowData.length > 0 && self.columnData.length > 0) {
            apos.schemas.findField(self.$form, 'row').val(self.rowData.length);
            apos.schemas.findField(self.$form, 'column').val(self.columnData.length);
        }
    }

    // Change all data to array of objects
    self.dataToArrayOfObjects = function () {
        // Loop over row to determine its value
        for (let row = 0; row < self.rowData.length; row++) {
            // Loop over column to determine its property
            for (let column = 0; column < self.columnData.length; column++) {
                self.rowsAndColumns[row] = Object.assign({}, self.rowsAndColumns[row] || {}, {
                    [self.columnData[column].field]: self.rowData[row][column]
                })
            }

            // Run checking column
            if (Object.keys(self.rowsAndColumns[row]).length !== self.columnData.length) {
                Object.keys(self.rowsAndColumns[row]).forEach((val, i) => {
                    let filter = self.columnData.filter((value, index) => value.field === val)
                    if (filter.length === 0) {
                        delete self.rowsAndColumns[row][val];
                    }
                })
            }
        }

        // Run Checking Rows
        if (self.rowsAndColumns.length !== self.rowData.length) {
            self.rowsAndColumns = self.rowsAndColumns.slice(0, self.rowData.length);
        }
    }

    self.resetDataOptions = function () {
        self.rowData = [];
        self.columnData = [];
        self.rowsAndColumns = [];
        if (self.tabulator && self.tabulator.options) {
            self.tabulator.options = Object.assign({}, self.originalOptionsTabulator);
        }
    }

    self.convertData = function () {
        let convertData = apos.schemas.findFieldset(self.$form, 'data').find('textarea');
        if (convertData.length > 0) {
            convertData.val(JSON5.stringify({
                data: self.rowData,
                columns: self.columnData
            }, {
                space: 2
            }));
            self.executeAutoResize(convertData.get(0));
        }

        // Check if the inputs value are the same as self.rowData & self.columnData value
        let rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
        let columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');

        if (rowInput.length > 0 && rowInput.val().length < 0) {
            rowInput.val(self.rowData.length)
        }

        if (columnInput.length > 0 && columnInput.val().length < 0) {
            columnInput.val(self.columnData.length)
        }
    }

    self.resetCustomTable = function () {
        let rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
        let columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');
        let dataInput = apos.schemas.findFieldset(self.$form, 'data').find('textarea');
        if (dataInput.length > 0 && dataInput.val().length > 0) {
            dataInput.val('');
        }
        if (rowInput.length > 0 && rowInput.val().length > 0) {
            rowInput.val('')
        }

        if (columnInput.length > 0 && columnInput.val().length > 0) {
            columnInput.val('');
            columnInput.attr('disabled', true);
        }
    }

    self.resetAjaxTable = function () {
        let ajaxURL = apos.schemas.findFieldset(self.$form, 'ajaxURL').find('input');
        if (ajaxURL.length > 0 && ajaxURL.val().length > 0) {
            ajaxURL.val('');
        }
    }
}

export default dataManagement;