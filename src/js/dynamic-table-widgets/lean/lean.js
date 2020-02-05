/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
// eslint-disable-next-line no-undef
apos.utils.widgetPlayers['dynamic-table'] = function (el, data, options) {
    // Use object so that devs can extend or
    let utils = {};
    let table = {};
    table.schemas = options.dynamicTableSchemas;

    utils.registerEvent = function (table) {
        // Store some event here
    }

    utils.dataToArrayOfObjects = function(objectData) {
        let arrayOfObjects = []
        let returnObject = {}
        // Loop over row to determine its value
        for (let row = 0; row < objectData.data.length; row++) {
            // Loop over column to determine its property
            for (let column = 0; column < objectData.columns.length; column++) {
                arrayOfObjects[row] = Object.assign(arrayOfObjects[row] || {}, {
                    [objectData.columns[column].title]: objectData.data[row][column]
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

    function updateOptions(myOptions) {
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
                            let data = utils.dataToArrayOfObjects(JSON5.parse(myOptions[property]))
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
        apos.dynamicTableLean[data._id].options = Object.assign({}, apos.dynamicTableLean[data._id].options, options, allOptions);
    }

    utils.initTable = function (tableDOM, tableOptions) {
        if (table.tabulator) {
            table.tabulator.destroy();
            table.tabulator = null;
        }

        updateOptions(tableOptions);

        let initTable = null
        if (apos.dynamicTableLean[data._id].options['data']) {
            initTable = new Tabulator(document.getElementById(tableDOM.id), apos.dynamicTableLean[data._id].options);
            initTable.setData(apos.dynamicTableLean[data._id].options['data'])
        } else {
            initTable = new Tabulator(document.getElementById(tableDOM.id), apos.dynamicTableLean[data._id].options);
        }
        table.tabulator = initTable;

        utils.registerEvent(table.el);
    }

    // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
    utils.findNested = function (path, data) {
        if (Array.isArray(path)) {
            path = path.join('.');
        }
        return path.split('.').reduce(function (xs, x) {
            return (xs && xs[x]) ? xs[x] : null
        }, data);
    }

    // This will initialize the table
    apos.utils.onReady(function () {
        table['el'] = el.querySelector('table#' + data._id);
        table.cloneTable = table.el.cloneNode();

        let parent = table.el.parentElement;
        parent.innerHTML = '';
        parent.appendChild(table.cloneTable.cloneNode());
        table.el = parent.querySelector('table#' + data._id);
        let getOptions = table.el.getAttribute('data-table-options');

        options = Object.assign({}, JSONfn.parse(table.el.getAttribute('data-table-originalOptions')))

        return utils.initTable(table.el, JSONfn.parse(getOptions));
    })

    apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, {
        utils: utils,
        [data._id]: table
    })
}