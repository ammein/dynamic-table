apos.utils.widgetPlayers['dynamic-table'] = function(el, data, options){

    // Use object so that devs can extend or 
    var utils = {};
    var table = {}
    table["el"] = el.querySelector("table#" + data._id);

    if(apos.dynamicTableLean && apos.dynamicTableLean[data._id]){
        delete apos.dynamicTableLean[data._id];
    }

    function getResult(query, callback) {
        apos.utils.get("/modules/dynamic-table/get-query", query, function (err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null,result.message);
        })
    }

    utils.registerEvent = function(table){
        // Store some event here
    }

    function initTable(){
        // Always Convert
        var obj = {
            headings: [],
            data: JSON5.parse(table.result.data).data
        };

        obj.headings = JSON5.parse(table.result.data).columns.reduce(function (init, next, i, arr) {
            return init.concat(next.title);
        }, []);

        var options = Object.assign({
            data: obj
        }, {})

        table.dataTable = new simpleDatatables.DataTable(table.el, options)

        // Delete previous table from ajax that cause duplication
        if(table.dataTable.options.ajax){
            delete table.dataTable.options.ajax
            table.dataTable.clear();
            table.dataTable.destroy();
            table.dataTable.init(options)
        }

        utils.registerEvent(table);
    }

    function initAjaxTable(){
        table.dataTable = new simpleDatatables.DataTable(table.el, {
            // Bug on Simpledatatable. Make data undefined. If not, it will load previous data from another table
            data : undefined,
            ajax: {
                url: table.ajaxOptions.ajax.url ? table.ajaxOptions.ajax.url : table.ajaxOptions.ajax,

                // Adjust Load Ajax Data
                load: table.ajaxOptions.load || function (xhr) {
                    var constructorDatatable = this;
                    if (
                        table.ajaxOptions.ajax &&
                        table.ajaxOptions.ajax.dataSrc &&
                        table.ajaxOptions.ajax.dataSrc.length > 0 &&
                        table.ajaxOptions.ajax.dataSrc !== ""
                    ) {
                        var data = JSON.findNested(table.ajaxOptions.ajax.dataSrc, JSON.parse(xhr.responseText));
                    } else {
                        var data = JSON.parse(xhr.responseText);
                    }
                    var convertData = [];

                    // Loop over the data and style any columns with numbers
                    for (let i = 0; i < data.length; i++) {
                        for (let property in data[i]) {
                            // If options.columns
                            if (table.ajaxOptions.columns) {
                                var filter = table.ajaxOptions.columns.filter((val, i) => val.data === property);
                                if (filter[0]) {
                                    // If filter success
                                    var getDataPos = filter[0].data;
                                    var getTitle = filter[0].title
                                    if (getDataPos.split(".").length > 1 && getDataPos.split(".")[getDataPos.split(".").length - getDataPos.split(".").length] === property) {
                                        convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                            [getTitle]: !window.isNaN(utils.findNested(getDataPos, data[i][property])) ? utils.findNested(getDataPos, data[i][property]).toString() : utils.findNested(getDataPos, data[i][property])
                                        })
                                    } else {
                                        convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                            [getTitle]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                                        })
                                    }
                                } else {
                                    // If filter no success at all
                                    convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                        [property]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                                    })
                                }
                            } else {
                                // If no options.columns
                                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                    [property]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                                })
                            }
                        }
                    }

                    // Data must return array of objects
                    return JSON.stringify(convertData);
                }
            }
        });

        utils.registerEvent(table);
    }

    // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
    utils.findNested = function (path, data) {
        return path.split(".").reduce(function (xs, x) {
            return (xs && xs[x]) ? xs[x] : null
        }, data);
    }

    apos.utils.onReady(function(){
        getResult({ id: data.dynamicTableId} , function(err,result){
            if(err){
                return apos.notify("ERROR : " + err, {
                    type : "error",
                    dismiss : true
                })
            }
            table["result"] = result;
            if (result.ajaxOptions && result.ajaxOptions.length > 0) {
                try {
                    table["ajaxOptions"] = JSON5.parse(result.ajaxOptions);
                    initAjaxTable();
                } catch (e) {
                    console.warn(e);
                }
            } else if(result.data && result.data.length > 0) {
                initTable();
            }else{
                apos.notify("There is no data to initialize the table. Table ID : " + data.dynamicTableId, {
                    type: "warn",
                    dismiss: true
                })
            }
        })
    })

    apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, {
        utils : utils,
        [data._id]: table
    }) 
}