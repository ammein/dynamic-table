(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-undef */

/* eslint-disable no-redeclare */
// eslint-disable-next-line no-undef
apos.utils.widgetPlayers['dynamic-table'] = function (el, data, options) {
  // Use object so that devs can extend or
  var utils = {};
  var table = {};
  table['el'] = el.querySelector('table#' + data._id);
  table.cloneTable = table.el.cloneNode();

  if (apos.dynamicTableLean && apos.dynamicTableLean[data._id]) {
    delete apos.dynamicTableLean[data._id];
  }

  function getResult(query, callback) {
    apos.utils.get('/modules/dynamic-table/get-fields', query, function (err, result) {
      if (err) {
        return callback(err);
      }

      return callback(null, result.message);
    });
  }

  utils.registerEvent = function (table) {// Store some event here
  };

  function initTable() {
    // Always clone the node on initializing. Bug found where other table did not get the same options due to the same Node reference
    var parent = table.el.parentElement;
    parent.innerHTML = '';
    parent.appendChild(table.cloneTable.cloneNode());
    table.el = parent.querySelector('table#' + data._id); // Always Convert

    var obj = {
      headings: [],
      // eslint-disable-next-line no-undef
      data: JSON5.parse(table.result.data).data
    }; // eslint-disable-next-line no-undef

    obj.headings = JSON5.parse(table.result.data).columns.reduce(function (init, next, i, arr) {
      return init.concat(next.title);
    }, []);
    var options = Object.assign({
      data: obj,
      ajax: undefined
    }, {}); // Start the table

    table.dataTable = new DataTable(table.el, options);
    utils.registerEvent(table.dataTable);
  }

  function initAjaxTable() {
    // Always clone the node on initializing. Bug found where other table did not get the same options due to the same Node reference
    var parent = table.el.parentElement;
    parent.innerHTML = '';
    parent.appendChild(table.cloneTable.cloneNode());
    table.el = parent.querySelector('table#' + data._id); // eslint-disable-next-line no-var

    var options = table.ajaxOptions.ajax.load ? {
      load: table.ajaxOptions.ajax.load
    } : {}; // Start the table

    table.dataTable = new DataTable(table.el, apos.utils.assign({
      // Bug on Simpledatatable. Make data undefined. If not, it will load previous data from another table
      data: undefined,
      ajax: {
        url: table.ajaxOptions.ajax.url ? table.ajaxOptions.ajax.url : table.ajaxOptions.ajax,
        // Adjust Load Ajax Data
        load: function load(xhr) {
          if (table.ajaxOptions.ajax && table.ajaxOptions.ajax.dataSrc && table.ajaxOptions.ajax.dataSrc.length > 0 && table.ajaxOptions.ajax.dataSrc !== '') {
            // eslint-disable-next-line no-var
            var data = JSON.findNested(table.ajaxOptions.ajax.dataSrc, JSON.parse(xhr.responseText));
          } else {
            // eslint-disable-next-line no-var
            var data = JSON.parse(xhr.responseText);
          }

          var convertData = []; // Loop over the data and style any columns with numbers

          for (var i = 0; i < data.length; i++) {
            var _loop = function _loop(property) {
              // If options.columns
              if (table.ajaxOptions.columns) {
                var filter = table.ajaxOptions.columns.filter(function (val) {
                  return val.data.includes(property);
                });

                if (filter.length > 0) {
                  for (var columns = 0; columns < table.ajaxOptions.columns.length; columns++) {
                    var getDataPos = table.ajaxOptions.columns[columns].data;
                    var getTitle = table.ajaxOptions.columns[columns].title;

                    if (getDataPos.split('.').length > 1 && getDataPos.includes(property)) {
                      // First match if nested object found
                      convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, getTitle, !window.isNaN(utils.findNested(getDataPos, data[i])) ? utils.findNested(getDataPos, data[i]).toString() : utils.findNested(getDataPos, data[i])));
                    } else if (getDataPos === property) {
                      // Second Match that match directly to the property name
                      convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, getTitle, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
                    }
                  }
                } else {
                  // If no match at all
                  convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, property, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
                }
              } else {
                // If no options.columns
                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, property, !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]));
              }
            };

            for (var property in data[i]) {
              _loop(property);
            }
          } // Data must return array of objects


          return JSON.stringify(convertData);
        }
      }
    }, options));
    table.dataTable.refresh();
    utils.registerEvent(table.dataTable);
  } // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f


  utils.findNested = function (path, data) {
    if (Array.isArray(path)) {
      path = path.join('.');
    }

    return path.split('.').reduce(function (xs, x) {
      return xs && xs[x] ? xs[x] : null;
    }, data);
  };

  apos.utils.onReady(function () {
    getResult({
      id: data.dynamicTableId
    }, function (err, result) {
      if (err) {
        return apos.notify('ERROR : ' + err, {
          type: 'error',
          dismiss: true
        });
      }

      table['result'] = result;

      if (result.ajaxOptions && result.ajaxOptions.length > 0) {
        try {
          table['ajaxOptions'] = JSON5.parse(result.ajaxOptions);
          initAjaxTable();
        } catch (e) {
          console.warn(e);
        }
      } else if (result.data && result.data.length > 0) {
        initTable();
      } else {
        apos.notify('There is no data to initialize the table. Table ID : ' + data.dynamicTableId, {
          type: 'warn',
          dismiss: true
        });
      }
    });
  });
  apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, _defineProperty({
    utils: utils,
    DataTable: DataTable
  }, data._id, table));
};

},{}]},{},[1]);
