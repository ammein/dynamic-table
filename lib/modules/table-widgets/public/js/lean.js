apos.utils.widgetPlayers['table-widgets'] = function(el, data, options){

    // Use object so that devs can extend or 
    var table = {}
    table["el"] = el.querySelector("table");

    table.dataTable = new DataTable(this.el);

    apos.tableWidgets = table;

    debugger;
}