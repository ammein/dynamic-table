/* global JSON5 */
apos.define('dynamic-table-widgets', {
    extend: 'apostrophe-widgets',
    construct: function (self, options) {

        self.schemas = options.dynamicTableSchemas;

        self.getResult = function (query, callback) {
            $.get('/modules/dynamic-table/get-fields', query, function (result) {
                if (result.status === 'error') {
                    return callback(result.message);
                }
                return callback(null, result.message);
            })
        }

        self.updateOptions = function (options) {
            let callbacksKey = getCallbacksKey();

            let allOptions = {}

            for (let key of Object.keys(options)) {
                if (options.hasOwnProperty(key)) {
                    if (callbacksKey.includes(key) && options[key]) {
                        allOptions[key] = options[key];
                    }
                }
            }

            // Loop ajaxResult object
            for (let property of Object.keys(options)) {
                if (options.hasOwnProperty(property)) {
                    switch (true) {
                        case property === 'ajaxURL' && options[property].length > 0:
                            try {
                                allOptions[property] = options[property]
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Ajax Table', e);
                            }
                            break;

                        case property === 'data' && options[property].length > 0:
                            try {
                                allOptions[property] = options[property]
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Data Table', e);
                            }
                            break;

                        default:
                            if (property !== 'data' && property !== 'ajaxURL' && options[property]) {
                                allOptions[property] = options[property]
                            }
                            break;
                    }
                }
            }

            self.tabulator.options = Object.assign({}, self.tabulator.options, allOptions);
        }

        self.initTable = function (tableDOM, options) {
            if (self.tabulator.table) {
                self.tabulator.table.destroy();
                self.tabulator.table = null;
            }
            self.updateOptions(options);
            let table = null
            // eslint-disable-next-line no-undef
            table = new Tabulator(tableDOM, self.tabulator.options);
            self.tabulator.table = table;
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

        function getCallbacksKey() {
            return self.schemas.filter(function (val, i) {
                return val.group.name === 'callbacks' && val.name !== 'callbacks';
            })
        }

        self.play = function ($widget, data, options) {
            self.tabulator = {
                options: {}
            }
            let table;
            // Always set data based on saves piece
            // self.setData($widget, data.dynamicTableId);
            table = $widget.find('table#' + data._id);
            let cloneTable = table.clone();
            let parent = table.parent();
            parent.empty();
            parent.append(cloneTable);

            return self.getResult({
                id: data.dynamicTableId
            }, function (err, result) {
                if (err) {
                    return apos.notify('ERROR : ' + err)
                }

                return self.initTable(table, result);
            })
        }
    }
})