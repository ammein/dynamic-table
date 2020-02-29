/* global Tabulator, Papa, JSON5, JSONfn */
let modal = function(self, options) {
    self.getJoin = function ($chooser) {
        let superAfterManagerSave = $chooser.afterManagerSave;
        let superAfterManagerCancel = $chooser.afterManagerCancel;
        let superOnChange = $chooser.onChange;
        self.getChoiceId = undefined;
        self.getNewChoiceId = undefined;

        // Destroy table and its options first to avoid DataTablesJQuery Problem
        self.destroyTable()

        if ($chooser.choices.length > 0) {
            self.getChoiceId = $chooser.choices[0].value;
        }

        if (self.getChoiceId) {
            // Get fields first and start
            self.getFieldsApi({
                id: self.getChoiceId
            }, function (err, result) {
                if (err) {
                    // Reset self.getChoiceId
                    self.getChoiceId = undefined;
                    return apos.utils.warn('Unable to get the table piece. Are you sure it saves correctly ?')
                }
                return self.getResultAndInitTable(result);
            })
        }

        $chooser.afterManagerSave = function () {
            superAfterManagerSave();
            // Refresh Form
            self.$form = $chooser.$choices.parent().parent().parent();
            self.getNewChoiceId = $chooser.choices[0].value;
            // Destroy table before reinitialization
            self.destroyTable();

            // Get field first
            return self.getFieldsApi({
                id: self.getNewChoiceId
            }, function (err, result) {
                if (err) {
                    return apos.utils.warn('Dynamic Table Piece not found');
                }

                self.getChoiceId = self.getNewChoiceId;

                return self.getResultAndInitTable(result);
            })

        }

        $chooser.afterManagerCancel = function () {
            superAfterManagerCancel();
            self.destroyTable();

            if ($chooser.choices.length > 0) {
                self.getChoiceId = $chooser.choices[0].value;
                return self.getFieldsApi({
                    id: self.getChoiceId
                }, function (err, result) {
                    if (err) {
                        return apos.utils.warn('Dynamic Table Piece not found');
                    }

                    return self.getResultAndInitTable(result);
                })
            }
        }

        $chooser.onChange = function() {
            superOnChange();

            if ($chooser.choices.length > 0) {
                self.destroyTable();
                self.getNewChoiceId = $chooser.choices[0].value;
                return self.getFieldsApi({
                    id: self.getNewChoiceId
                }, function (err, result) {
                    if (err) {
                        return apos.utils.warn('Dynamic Table Piece not found');
                    }

                    self.getChoiceId = self.getNewChoiceId;

                    return self.getResultAndInitTable(result);
                })
            }
        }
    }

    self.changeTabRebuildTable = function (element, tab) {
        let table = null
        if (self.$ajaxURL.find('input').val().length > 0 && self.rowData.length === 0 && self.columnData.length === 0) {
            // Pass extra arguments for specific table element when change tab
            self.executeAjax(self.tabulator.options);
        } else if (self.$ajaxURL.find('input').val().length === 0 && self.rowData.length > 0 && self.columnData.length > 0) {
            if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
                self.resetAjaxOptions();
            }
            table = new Tabulator(element.querySelector('table'), Object.assign({}, self.tabulator.options, {
                columns: self.columnData
            }));

            self.tabulator.table = table;
            self.tabulator.table.setData(self.rowsAndColumns);
        }
        // Apply Event
        self.registerTableEvent(table);
    }

    // To always send the data that has schema type of array
    self.arrayFieldsArrange = function (arrayItems, fieldName) {
        // Just pass the array items from rowData & columnData
        let config = {
            delimiter: self.tableDelimiter
        }
        if (self.tableEscapeChar) {
            config.escapeChar = self.tableEscapeChar;
        }
        switch (fieldName) {
            case 'adjustRow':
                for (let row = 0; row < self.rowData.length; row++) {
                    // Always replace value and re-edit id
                    arrayItems[row] = {
                        id: apos.utils.generateId(),
                        rowContent: Papa.unparse(self.rowData, {
                            newLine: '\r\n',
                            quotes: true
                        }).split('\r\n').map((val) => val.replace(/(",")/g, '|').replace(/(^")|("$)/g, '').replace(/,/g, '","').replace(/\|/g, ','))[row]
                    }
                    // Chaining replace due to Papa Unparse bug where '\",\"' is become ',' on very first row
                    // While ',' is become '\",\"'
                    // So in order to fix that, we have to replace so many string
                }
                break;

            case 'adjustColumn':
                for (let column = 0; column < self.columnData.length; column++) {
                    arrayItems[column] = {
                        id: apos.utils.generateId(),
                        columnContent: self.columnData[column].title
                    }
                }
                break;

            default:
                // eslint-disable-next-line no-self-assign
                arrayItems = arrayItems;
                break;
        }

        return arrayItems;
    }

    self.updateFromArrayFields = function (arrayItems, fieldName) {
        // Just pass the array items from rowData & columnData
        let config = {
            delimiter: self.tableDelimiter
        }
        if (self.tableEscapeChar) {
            config.escapeChar = self.tableEscapeChar;
        }
        switch (fieldName) {
            case 'adjustRow':
                for (let row = 0; row < arrayItems.length; row++) {
                    // Tough parsing but it works !
                    self.rowData[row] = Papa.parse(arrayItems[row].rowContent, {
                        escapeChar: config.escapeChar || '"',
                        transform: function (value) {
                            let store = value;
                            // Replace the quote value to normal
                            store = store.replace(new RegExp(`\\\\([\\s\\S])|(${config.escapeChar || '"'})`, 'g'), '$1')
                            return store;
                        }
                    }).data[0]

                }
                break;

            case 'adjustColumn':
                for (let column = 0; column < arrayItems.length; column++) {
                    self.columnData.map(function (value, i, arr) {
                        // In Column, there will be an object, so loop it !
                        for (let property of Object.keys(value)) {
                            if (value.hasOwnProperty(property)) {
                                // Make sure its on same array
                                if (i === column && property !== 'field') {
                                    value[property] = arrayItems[column].columnContent;
                                } else if (i === column && property === 'field') {
                                    // Rename the field based on the title property using ApostropheCMS Camel Name utils.
                                    value[property] = apos.utils.camelName(arrayItems[column].columnContent);
                                }
                            }
                        }
                        return value;
                    })
                }
                break;
        }

        if (self.rowData.length > 0 && self.columnData.length > 0) {
            // Update to make convert enabled
            self.updateRowsAndColumns();
        }

        // If no rowData and ColumnData at all, must be the ajax. If not, just do nothing
        if (self.$ajaxURL.find('input').val().length > 0 && self.rowData.length === 0 && self.columnData.length === 0) {
            self.$ajaxURL.trigger('change');
        }

        if (self.$ajaxURL.find('input').val().length === 0 && self.rowData.length > 0 && self.columnData.length > 0) {
            self.$ajaxURL.find('input').val('')
        }
    }

    /**
     * Widgets Editor Modal Utils Begins
     */
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

                    case property === 'tabulatorOptions' && ajaxResult[property].code.length > 0:
                        try {
                            self.tabulator.options = Object.assign({}, self.tabulator.options, JSONfn.parse(ajaxResult[property].code))
                            if (self.tabulator.table) {
                                self.restartTable();
                            }
                        } catch (e) {
                            // Leave the error alone
                            apos.utils.warn('Error Init Ajax Table', e);
                        }
                        break;
                }
            }
        }
    }

    self.beforeSave = function (callback) {
        // Should always return callback null. Because if you put an error to it, it will never be save.
        // We don't want that
        if (self.getChoiceId !== self.getNewChoiceId && self.getNewChoiceId) {
            // Update previous piece
            return self.removeUrlsApi({
                id: self.getChoiceId,
                url: window.location.pathname
            }, function (err) {
                if (err) {
                    apos.utils.warn('Cannot remove url on previous piece');
                }
                // Update latest piece
                return self.updateFieldsApi({
                    id: self.getNewChoiceId,
                    url: window.location.pathname
                }, function (err) {
                    if (err) {
                        apos.utils.warn('Unable to update new piece save');
                        return callback(null);
                    }
                    // reset choice value
                    self.getChoiceId = self.getNewChoiceId;

                    return callback(null);
                })
            })
        } else if (self.getNewChoiceId && !self.getChoiceId) {
            // Update latest piece
            return self.updateFieldsApi({
                id: self.getNewChoiceId,
                url: window.location.pathname
            }, function (err) {
                if (err) {
                    apos.utils.warn('Unable to update new piece save');
                    return callback(null)
                }
                // reset choice value
                self.getChoiceId = self.getNewChoiceId;

                return callback(null);
            })
        }

        return callback(null);
    }
}

export default modal;