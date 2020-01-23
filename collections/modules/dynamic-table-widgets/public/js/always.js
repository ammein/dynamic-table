(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* global JSON5, Tabulator */
apos.define('dynamic-table-widgets', {
  extend: 'apostrophe-widgets',
  construct: function construct(self, options) {
    self.schemas = options.dynamicTableSchemas; // Change all data to array of objects

    self.dataToArrayOfObjects = function (objectData) {
      var arrayOfObjects = [];
      var returnObject = {}; // Loop over row to determine its value

      var _loop = function _loop(row) {
        // Loop over column to determine its property
        for (var column = 0; column < objectData.columns.length; column++) {
          arrayOfObjects[row] = Object.assign(arrayOfObjects[row] || {}, _defineProperty({}, objectData.columns[column].title, objectData.data[row][column]));
        } // Run checking column


        if (Object.keys(arrayOfObjects[row]).length !== objectData.columns.length) {
          Object.keys(arrayOfObjects[row]).forEach(function (val, i) {
            var filter = objectData.columns.filter(function (value, index) {
              return value.title === val;
            });

            if (filter.length === 0) {
              delete arrayOfObjects[row][val];
            }
          });
        }
      };

      for (var row = 0; row < objectData.data.length; row++) {
        _loop(row);
      } // Run Checking Rows


      if (arrayOfObjects.length !== objectData.data.length) {
        arrayOfObjects = arrayOfObjects.slice(0, objectData.data.length);
      }

      returnObject = {
        data: arrayOfObjects,
        columns: objectData.columns
      };
      return returnObject;
    };

    self.updateOptions = function (options) {
      var allOptions = {};

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
                var data = self.dataToArrayOfObjects(JSON5.parse(options[property]));

                for (var key in data) {
                  if (data.hasOwnProperty(key)) {
                    allOptions[key] = data[key];
                  }
                }
              } catch (e) {
                // Leave the error alone
                apos.utils.warn('Error Init Data Table', e);
              }

              break;
          }
        }
      }

      self.tabulator.options = Object.assign({}, self.tabulator.options, allOptions, self.options.tabulatorOptions);
    };

    self.initTable = function (tableDOM, options) {
      if (self.tabulator.table) {
        self.tabulator.table.destroy();
        self.tabulator.table = null;
      }

      self.updateOptions(options);
      var table = null;

      if (self.tabulator.options['data']) {
        table = new Tabulator(document.getElementById(tableDOM.get(0).id), self.tabulator.options);
        table.setData(self.tabulator.options['data']);
      } else {
        table = new Tabulator(document.getElementById(tableDOM.get(0).id), self.tabulator.options);
      }

      self.tabulator.table = table;
    };

    self.play = function ($widget, data, options) {
      self.tabulator = {
        options: {}
      };
      var table, tableOptions; // Always set data based on saves piece

      table = $widget.find('table#' + data._id);
      tableOptions = table.data('table-options');
      var cloneTable = table.clone();
      var parent = table.parent();
      parent.empty();
      parent.append(cloneTable);
      return self.initTable(table, tableOptions);
    };
  }
});

},{}]},{},[1]);
