apos.utils.widgetPlayers['dynamic-table-widgets'] = function(el, data, options){

    // Use object so that devs can extend or 
    var table = {}
    table["el"] = el.querySelector("table#" + data._id);

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function initAjaxTable(){
        table.dataTable = new DataTable(table.el, {
            ajax: {
                url: table.ajaxOptions.ajax.url ? table.ajaxOptions.ajax.url : table.ajaxOptions.ajax,

                // Adjust Load Ajax Data
                load: function (xhr) {
                    // Get Response
                    var data = JSON.parse(xhr.responseText);

                    // Transform data to get the title (columns) object and adjust it
                    var obj = {
                        // data array
                        data: []
                    };

                    // Loop over the objects to get the values
                    for (var i = 0; i < data.length; i++) {

                        obj.data[i] = {};

                        for (var p in data[i]) {
                            if (data[i].hasOwnProperty(p)) {
                                // filter the ajaxOptions to get specific key data
                                if(table.ajaxOptions.columns){
                                    var match = table.ajaxOptions.columns.filter(function (value, i, arr) {
                                        return value.data === p;
                                    })
                                }
                                obj.data[i][toTitleCase(match ? match[0].title ? match[0].title : toTitleCase(apos.utils.cssName(match[0].data).replace(/-/i, " ")) : p)] = data[i][p];

                                match = undefined;
                            }
                        }
                    }

                    return JSON.stringify(obj.data);
                }
            }
        });


        table.dataTable.on("datatable.ajax.loaded", function () {
            // IE9
            this.wrapper.className = this.wrapper.className.replace(" dataTable-loading", "");
        });
    }


    try {
        table["ajaxOptions"] = JSON.parse(data.ajaxOptions);
        initAjaxTable();
    } catch (e) {
        console.warn(e);
    }

    apos.tableWidgets = table;

    debugger;
}