(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-var */

/* eslint-disable no-undef */

/* eslint-disable no-redeclare */
// eslint-disable-next-line no-undef
window.$.fn.DataTable = {};

apos.utils.widgetPlayers['dynamic-table'] = function (el, data, options) {
  // Use object so that devs can extend or
  var utils = {};
  var table = {};
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
    });
  };

  apos.utils.onReady(function () {
    var myTable; // Always set data based on saves piece
    // self.setData($widget, data.dynamicTableId);

    myTable = el.querySelector('table#' + data._id);
    var cloneTable = myTable.cloneNode();
    var parent = myTable.parentElement;
    parent.innerHTML = '';
    parent.appendChild(cloneTable);
    utils.getResult({
      id: data.dynamicTableId
    }, function (err, result) {
      if (err) {
        return apos.notify('ERROR : ' + err);
      }

      try {
        var DataTableOptions = result.data && result.data.length > 0 ? JSON5.parse(result.data) : undefined;
      } catch (e) {
        apos.utils.warn('Error when parsing options, are you sure your option is properly configured ? \n\n' + e);
      }

      try {
        var DataTableAjaxOptions = result.ajaxOptions && result.ajaxOptions.length > 0 ? JSON5.parse(result.ajaxOptions) : undefined;
      } catch (error) {
        apos.utils.warn('Error when parsing options, are you sure your option is properly configured ? \n\n' + e);
      }

      table = parent.querySelector('table#' + data._id);
      $(table).DataTable(DataTableOptions || DataTableAjaxOptions);
    });
  });
  apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, _defineProperty({
    utils: utils,
    DataTable: dt
  }, data._id, table));
};

},{}]},{},[1]);
