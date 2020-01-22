(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/* global JSON5 */
apos.define('dynamic-table-widgets', {
  extend: 'apostrophe-widgets',
  construct: function construct(self, options) {
    self.schemas = options.dynamicTableSchemas;

    self.getResult = function (query, callback) {
      $.get('/modules/dynamic-table/get-fields', query, function (result) {
        if (result.status === 'error') {
          return callback(result.message);
        }

        return callback(null, result.message);
      });
    };

    self.updateOptions = function (options) {
      var callbacksKey = getCallbacksKey();
      var allOptions = {};

      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          if (callbacksKey.includes(key) && options[key]) {
            allOptions[key] = options[key];
          }
        }
      } // Loop ajaxResult object


      for (var _i = 0, _Object$keys = Object.keys(options); _i < _Object$keys.length; _i++) {
        var property = _Object$keys[_i];

        if (options.hasOwnProperty(property)) {
          switch (true) {
            case property === 'ajaxURL' && options[property].length > 0:
              try {
                allOptions[property] = options[property];
              } catch (e) {
                // Leave the error alone
                apos.utils.warn('Error Init Ajax Table', e);
              }

              break;

            case property === 'data' && options[property].length > 0:
              try {
                allOptions[property] = options[property];
              } catch (e) {
                // Leave the error alone
                apos.utils.warn('Error Init Data Table', e);
              }

              break;

            default:
              if (property !== 'data' && property !== 'ajaxURL' && options[property]) {
                allOptions[property] = options[property];
              }

              break;
          }
        }
      }

      self.tabulator.options = Object.assign({}, self.tabulator.options, allOptions);
    };

    self.initTable = function (tableDOM, options) {
      if (self.tabulator.table) {
        self.tabulator.table.destroy();
        self.tabulator.table = null;
      }

      self.updateOptions(options);
      var table = null; // eslint-disable-next-line no-undef

      table = new Tabulator(tableDOM, self.tabulator.options);
      self.tabulator.table = table;
    };

    self.getResultAndInitTable = function (ajaxResult) {
      // Loop ajaxResult object
      for (var _i2 = 0, _Object$keys2 = Object.keys(ajaxResult); _i2 < _Object$keys2.length; _i2++) {
        var property = _Object$keys2[_i2];

        if (ajaxResult.hasOwnProperty(property)) {
          switch (true) {
            case property === 'ajaxURL' && ajaxResult[property].length > 0:
              try {
                self.executeAjax(ajaxResult[property]);
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
    };

    function getCallbacksKey() {
      return self.schemas.filter(function (val, i) {
        return val.group.name === 'callbacks' && val.name !== 'callbacks';
      });
    }

    self.play = function ($widget, data, options) {
      self.tabulator = {
        options: {}
      };
      var table; // Always set data based on saves piece
      // self.setData($widget, data.dynamicTableId);

      table = $widget.find('table#' + data._id);
      var cloneTable = table.clone();
      var parent = table.parent();
      parent.empty();
      parent.append(cloneTable);
      return self.getResult({
        id: data.dynamicTableId
      }, function (err, result) {
        if (err) {
          return apos.notify('ERROR : ' + err);
        }

        return self.initTable(table, result);
      });
    };
  }
});

},{}]},{},[1]);
