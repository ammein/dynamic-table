/* eslint-disable no-var */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
// eslint-disable-next-line no-undef
window.$.fn.DataTable = {};
apos.utils.widgetPlayers['dynamic-table'] = function(el, data, options) {

    // Use object so that devs can extend or
    let utils = {};
    let table = {}
    table['el'] = el.querySelector('table#' + data._id);
    table.cloneTable = table.el.cloneNode();

    if (apos.dynamicTableLean && apos.dynamicTableLean[data._id]) {
        delete apos.dynamicTableLean[data._id];
    }

    utils.getResult = function (query, callback) {
        $.get('/modules/dynamic-table/get-fields', query, function (result) {
            if (result.status === 'error') {
                return callback(result.message);
            }
            return callback(null, result.message);
        })
    }

    apos.utils.onReady(function() {
        let myTable;
        // Always set data based on saves piece
        // self.setData($widget, data.dynamicTableId);
        myTable = el.querySelector('table#' + data._id);
        let cloneTable = myTable.cloneNode();
        let parent = myTable.parentElement;
        parent.innerHTML = '';
        parent.appendChild(cloneTable);

        utils.getResult({
            id: data.dynamicTableId
        }, function (err, result) {
            if (err) {
                return apos.notify('ERROR : ' + err)
            }

            try {
                var DataTableOptions = result.data && result.data.length > 0 ? JSON5.parse(result.data) : undefined;
            } catch (e) {
                apos.utils.warn('Error when parsing options, are you sure your option is properly configured ? \n\n' + e)
            }
            try {
                var DataTableAjaxOptions = result.ajaxOptions && result.ajaxOptions.length > 0 ? JSON5.parse(result.ajaxOptions) : undefined;
            } catch (error) {
                apos.utils.warn('Error when parsing options, are you sure your option is properly configured ? \n\n' + e)
            }

            table = parent.querySelector('table#' + data._id);
            $(table).DataTable(DataTableOptions || DataTableAjaxOptions);
        })
    })

    apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, {
        utils: utils,
        DataTable: dt,
        [data._id]: table
    })
}