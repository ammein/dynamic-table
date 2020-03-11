(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* global Tabulator, JSONfn */
apos.utils.widgetPlayers['dynamic-table'] = function (el, data, options) {
  // Use object so that devs can extend or
  var utils = {};
  var table = {};
  table.schemas = options.dynamicTableSchemas;

  utils.registerEvent = function (table) {// Store some event here
  };

  utils.dataToArrayOfObjects = function (objectData) {
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

  utils.updateOptions = function (myOptions) {
    var allOptions = {};

    for (var _i = 0, _Object$keys = Object.keys(myOptions); _i < _Object$keys.length; _i++) {
      var property = _Object$keys[_i];

      if (myOptions.hasOwnProperty(property)) {
        switch (true) {
          case property === 'ajaxURL' && myOptions[property].length > 0:
            try {
              allOptions[property] = myOptions[property];
            } catch (e) {
              // Leave the error alone
              apos.utils.warn('Error Init Ajax Table', e);
            }

            break;

          case property === 'data' && myOptions[property].length > 0:
            try {
              var _data = utils.dataToArrayOfObjects(JSONfn.parse(myOptions[property]));

              for (var key in _data) {
                if (_data.hasOwnProperty(key)) {
                  allOptions[key] = _data[key];
                }
              }
            } catch (e) {
              // Leave the error alone
              apos.utils.warn('Error Init Data Table', e);
            }

            break;

          case property === 'tabulatorOptions' && myOptions[property].code.length > 0:
            try {
              allOptions = _objectSpread({}, allOptions, {}, JSONfn.parse(myOptions[property].code));
            } catch (e) {
              // Leave the error alone
              apos.utils.warn('Error Init Ajax Table', e);
            }

            break;
        }
      }
    }

    apos.dynamicTableLean[data._id].options = Object.assign({}, apos.dynamicTableLean[data._id].options, options, allOptions);
  };

  utils.initTable = function (tableDOM, tableOptions) {
    if (table.tabulator) {
      table.tabulator.destroy();
      table.tabulator = null;
    }

    utils.updateOptions(typeof tableOptions === 'string' ? JSONfn.parse(tableOptions) : tableOptions);
    var initTable = null;

    if (apos.dynamicTableLean[data._id].options['data']) {
      initTable = new Tabulator(document.getElementById(tableDOM.id), apos.dynamicTableLean[data._id].options);
      initTable.setData(apos.dynamicTableLean[data._id].options['data']);
    } else {
      initTable = new Tabulator(document.getElementById(tableDOM.id), apos.dynamicTableLean[data._id].options);
    }

    table.tabulator = initTable;
    utils.registerEvent(table.el);
  }; // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f


  utils.findNested = function (path, data) {
    if (Array.isArray(path)) {
      path = path.join('.');
    }

    return path.split('.').reduce(function (xs, x) {
      return xs && xs[x] ? xs[x] : null;
    }, data);
  }; // This will initialize the table


  apos.utils.onReady(function () {
    table['el'] = el.querySelector('table#' + data._id);
    table.cloneTable = table.el.cloneNode();
    var parent = table.el.parentElement;
    parent.innerHTML = '';
    parent.appendChild(table.cloneTable.cloneNode());
    table.el = parent.querySelector('table#' + data._id);
    var getOptions = table.el.getAttribute('data-table-options');
    options = Object.assign({}, JSONfn.parse(table.el.getAttribute('data-table-originalOptions')));
    return utils.initTable(table.el, JSONfn.parse(getOptions));
  });
  apos.dynamicTableLean = apos.utils.assign(apos.dynamicTableLean || {}, _defineProperty({
    utils: utils
  }, data._id, table));
};

},{}]},{},[1]);
