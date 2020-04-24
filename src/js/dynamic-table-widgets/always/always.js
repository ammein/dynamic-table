/* global Tabulator, JSONfn */
apos.define('dynamic-table-widgets', {
    extend: 'apostrophe-widgets',
    construct: function (self, options) {

        self.schemas = options.dynamicTableSchemas;

        // Change all data to array of objects
        self.dataToArrayOfObjects = function (objectData) {
            let arrayOfObjects = []
            let returnObject = {}
            // Loop over row to determine its value
            for (let row = 0; row < objectData.data.length; row++) {
                // Loop over column to determine its property
                for (let column = 0; column < objectData.columns.length; column++) {
                    arrayOfObjects[row] = Object.assign(arrayOfObjects[row] || {}, {
                        [objectData.columns[column].field]: objectData.data[row][column]
                    })
                }

                // Run checking column
                if (Object.keys(arrayOfObjects[row]).length !== objectData.columns.length) {
                    Object.keys(arrayOfObjects[row]).forEach((val, i) => {
                        let filter = objectData.columns.filter((value, index) => value.title === val)
                        if (filter.length === 0) {
                            delete arrayOfObjects[row][val];
                        }
                    })
                }
            }

            // Run Checking Rows
            if (arrayOfObjects.length !== objectData.data.length) {
                arrayOfObjects = arrayOfObjects.slice(0, objectData.data.length);
            }

            returnObject = {
                data: arrayOfObjects,
                columns: objectData.columns
            }

            return returnObject;
        }

        self.updateOptions = function (myOptions, id) {
            let allOptions = {}
            for (let property of Object.keys(myOptions)) {
                if (myOptions.hasOwnProperty(property)) {
                    switch (true) {
                        case property === 'ajaxURL' && myOptions[property].length > 0:
                            try {
                                allOptions[property] = myOptions[property]
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Ajax Table', e);
                            }
                            break;

                        case property === 'data' && myOptions[property].length > 0:
                            try {
                                let data = self.dataToArrayOfObjects(JSONfn.parse(myOptions[property]))
                                for (let key in data) {
                                    if (data.hasOwnProperty(key)) {
                                        allOptions[key] = data[key]
                                    }
                                }
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Data Table', e);
                            }
                            break;

                        case property === 'tabulatorOptions' && myOptions[property].code.length > 0:
                            try {
                                allOptions = { ...allOptions, ...JSONfn.parse(myOptions[property].code) }
                            } catch (e) {
                                // Leave the error alone
                                apos.utils.warn('Error Init Ajax Table', e);
                            }
                            break;
                    }
                }
            }

            self.tabulator[id].options = Object.assign({}, self.tabulator[id].options, self.options.tabulatorOptions, allOptions);
        }

        self.initTable = function (tableDOM, myOptions) {
            let id = tableDOM.get(0).id;
            if (self.tabulator[id].table) {
                self.tabulator[id].table.destroy();
                self.tabulator[id].table = null;
            }
            self.updateOptions(typeof myOptions === 'string' ? JSONfn.parse(myOptions) : myOptions, id);
            let table = null
            if (self.tabulator[id].options['data']) {
                table = new Tabulator(document.getElementById(tableDOM.get(0).id), self.tabulator[id].options);
                table.setData(self.tabulator[id].options['data'])
            } else {
                table = new Tabulator(document.getElementById(tableDOM.get(0).id), self.tabulator[id].options);
            }
            self.tabulator[id].table = table;
        }

        self.play = function ($widget, data, options) {
            self.tabulator = Object.assign({}, self.tabulator, {
                [data._id]: {
                    options: {}
                }
            });
            let table, tableOptions;
            // Always set data based on saves piece
            table = $widget.find('table#' + data._id);
            tableOptions = table.data('table-options')
            let cloneTable = table.clone();
            let parent = table.parent();
            parent.empty();
            parent.append(cloneTable);

            return self.initTable(table, tableOptions);
        }
    }
})