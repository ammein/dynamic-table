(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":1,"timers":2}],3:[function(require,module,exports){
(function (setImmediate){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

apos.define('custom-code-editor', {
  construct: function construct(self, options) {
    // create superPopulate to extend method
    var superPopulate = self.populate;
    var superConvert = self.convert; // Get extension self object

    var _this = self; // Clean up data and reject if unacceptable

    self.convert = function (data, name, $field, $el, field, callback) {
      return superConvert(data, name, $field, $el, field, function () {
        if (self.tabulator && self.tabulator.originalCache[name]) {
          var returnObj = {}; // eslint-disable-next-line no-undef

          var dataObj = JSONfn.parse(self.tabulator.convertJSONFunction(data[name].code)); // eslint-disable-next-line no-undef

          var originalObj = self.tabulator.originalCache[name].reduce(function (init, next, i) {
            return Object.assign({}, init, next);
          }, {}); // eslint-disable-next-line no-undef

          var cacheObj = self.tabulator.cache[name].reduce(function (init, next, i) {
            return Object.assign({}, init, next);
          }, {});

          var _loop = function _loop(key) {
            if (dataObj.hasOwnProperty(key)) {
              var oriKey = Object.getOwnPropertyNames(originalObj).filter(function (val, i) {
                return val === key;
              })[0];

              if (key === oriKey) {
                // Match String function
                if (dataObj[key].toString() !== originalObj[key].toString()) {
                  returnObj[key] = cacheObj[key];
                }
              }
            }
          };

          for (var key in dataObj) {
            _loop(key);
          } // Set into object serverside


          if (Object.getOwnPropertyNames(returnObj).length > 0) {
            // eslint-disable-next-line no-undef
            data[name].code = JSONfn.stringify(returnObj);
          } else {
            delete data[name];
          }
        }

        return setImmediate(callback);
      });
    };

    self.populate = function (object, name, $field, $el, field, callback) {
      superPopulate(object, name, $field, $el, field, callback); // Locate the element on specific schema

      var $fieldSet = apos.schemas.findFieldset($el, name); // Get Editor

      var $fieldInput = $fieldSet.find('[data-editor]').get(0); // Init Editor
      // eslint-disable-next-line no-undef

      var editor = ace.edit($fieldInput);
      self.tabulator = {
        callbacks: {},
        cache: {},
        originalCache: {}
      };

      self.tabulator.events = function (editorType) {
        var onChange = debounce(function (delta) {
          // delta.start, delta.end, delta.lines, delta.action
          var value = self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g) !== null ? self[editorType].editor.session.getValue().match(/(\{(.|[\r\n])+\})/g)[0] : '{}';

          try {
            value = self.tabulator.convertJSONFunction(value); // Check only that is change
            // eslint-disable-next-line no-undef

            value = self.tabulator.cacheCheck(editorType, JSONfn.parse(value)); // Restart Table

            self.tabulator.restartTableCallback(value);
          } catch (e) {
            apos.notify("Oops! Your code is not working! Check the error on console.", {
              type: 'error',
              dismiss: true
            });
          }
        }, 2000); // Will off the event listener for not triggering this type of events too many times when switching tabs (Bugs)

        self[editorType].editor.session.off('change', onChange); // Add new event listener on change

        self[editorType].editor.session.on('change', onChange);
      };

      self.tabulator.restartTableCallback = function (callbackObj) {
        // eslint-disable-next-line no-undef
        apos.dynamicTableUtils.tabulator.options = Object.assign({}, apos.dynamicTableUtils.tabulator.options, callbackObj); // Restart Table

        apos.dynamicTableUtils.restartTable();
      }; // Thanks to the article https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf


      var debounce = function debounce(func, delay) {
        var inDebounce;
        return function () {
          var context = this;
          var args = arguments;
          clearTimeout(inDebounce);
          inDebounce = setTimeout(function () {
            return func.apply(context, args);
          }, delay);
        };
      }; // Using JSONfn (https://github.com/vkiryukhin/jsonfn) to make function enable on JSON Object

      /**
       * To convert string inputs to JSONFn format so that able to use JSONfn.parse(value) later
       */


      self.tabulator.convertJSONFunction = function (value) {
        value = self.tabulator.JSONFunctionStringify(value);
        value = self.tabulator.addNewLineInFunction(value);
        value = self.tabulator.removeBreakLines(value);
        return value;
      };
      /**
       * To convert object to string for for friendly inputs adjustment on custom-code-editor
       */


      self.tabulator.convertToString = function (value) {
        // eslint-disable-next-line no-undef
        value = JSONfn.stringify(value);
        value = self.tabulator.JSONFunctionParse(value);
        value = self.tabulator.JSONFuncToNormalString(value);
        return value;
      }; // Remove break lines and replace with '\n' string for JSONfn.parse() to use


      self.tabulator.removeBreakLines = function (text) {
        return text.replace(/\s+(?!\S)/g, '');
      }; // Restructurize string into friendly & familiar string. Good case for Objects Javascript for Custom-Code-Editor display


      self.tabulator.JSONFuncToNormalString = function (text) {
        text = text.replace(/\\n/g, '\n');
        text = text.replace(/\\"/g, '"');
        return text.replace(/"(\{(.|[\r\n])+\})"/g, '$1');
      }; // Remove all string quotes from function and keys to make it normal string object display on custom-code-editor


      self.tabulator.JSONFunctionParse = function (text) {
        return text.replace(/(?:"(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})")|"(\w+?)"(?=(\s*?):\s*(?!function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}))/g, '$1$3');
      }; // Anything that has break lines replace it with '\n'. Also make the strings of all of them in single line of string. Easy for JSONfn.parse()


      self.tabulator.addNewLineInFunction = function (text) {
        // Store Match String
        var textArr = text.match(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g); // Replace with empty string

        text = text.replace(/function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}/g, '');
        textArr = textArr.map(function (val, i, arr) {
          val = val.replace(/"/g, '\\"');
          return val.replace(/(\r\n|\n|\r)/g, '\\n');
        });
        var i = -1;
        text = text.replace(/""/g, function (val) {
          i++;
          return '"' + textArr[i] + '"';
        });
        return text;
      }; // Convert everything from string that has Object Javascript format with double quotes string. Later to be use on JSON.parse()


      self.tabulator.JSONFunctionStringify = function (text) {
        return text.replace(/(\w+?)(?=(\s*:+?))|(function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})|(\w+?)(?=(\s*?):\s*function\s*([A-z0-9]+)?\s*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)\s*\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})/g, '"$&"');
      }; // To check and compare with cache. If changes detected, replace the value. Also return with new object on changes


      self.tabulator.cacheCheck = function (editorType, valueObj) {
        var returnObj = {}; // Return Adjusted Changes Only

        self.tabulator.cache[editorType].forEach(function (val, i, arr) {
          for (var key in valueObj) {
            if (valueObj.hasOwnProperty(key)) {
              if (Object.getOwnPropertyNames(val)[0] === key && val[key].toString() !== valueObj[key].toString()) {
                returnObj[key] = valueObj[key];
              }
            }
          }
        }); // Adjust Cache

        var _loop2 = function _loop2(key) {
          if (valueObj.hasOwnProperty(key)) {
            self.tabulator.cache[editorType] = self.tabulator.cache[editorType].map(function (val, i, arr) {
              if (key === Object.getOwnPropertyNames(val)[0]) {
                return _defineProperty({}, key, valueObj[key]);
              } else {
                return val;
              }
            });
          }
        };

        for (var key in valueObj) {
          _loop2(key);
        }

        return returnObj;
      }; // Store all editor cache


      self.tabulator.editorCache = function (editorType, string) {
        self.tabulator.cache[editorType] = [];
        self.tabulator.originalCache[editorType] = []; // eslint-disable-next-line no-undef

        var JSONFuncObj = JSONfn.parse(self.tabulator.convertJSONFunction(string));

        for (var key in JSONFuncObj) {
          if (JSONFuncObj.hasOwnProperty(key)) {
            self.tabulator.cache[editorType] = self.tabulator.cache[editorType].concat(_defineProperty({}, key, JSONFuncObj[key]));
            self.tabulator.originalCache[editorType] = self.tabulator.originalCache[editorType].concat(_defineProperty({}, key, JSONFuncObj[key]));
          }
        }
      }; // All Editor Callbacks strings to use and to edit


      self.tabulator.callbackStrings = function (editorType) {
        var string = "";

        switch (editorType) {
          case 'tableCallback':
            string = "{\n                                    tableBuilding: function () {},\n                                    tableBuilt: function () {}\n                                }";
            break;

          case 'columnCallback':
            string = "{\n                                columnMoved: function (column, columns) {\n                                    //column - column component of the moved column\n                                    //columns- array of columns in new order\n                                }, \n                                columnResized: function (column) {\n                                    //column - column component of the resized column\n                                },\n                                columnVisibilityChanged: function (column, visible) {\n                                    //column - column component\n                                    //visible - is column visible (true = visible, false = hidden)\n                                },\n                                columnTitleChanged: function (column) {\n                                    //column - column component\n                                }\n                            }";
            break;

          case 'ajaxCallback':
            string = "{\n                                ajaxRequesting: function (url, params) {\n                                    //url - the URL of the request\n                                    //params - the parameters passed with the request\n                                },\n                                ajaxResponse: function (url, params, response) {\n                                    // console.log('Table Ajax Response', response);\n                                    return response;\n                                },\n                                ajaxError: function (xhr, textStatus, errorThrown) {\n                                    //xhr - the XHR object\n                                    //textStatus - error type\n                                    //errorThrown - text portion of the HTTP status\n                                }\n                            }";
            break;

          case 'rowCallback':
            string = "{\n                                rowClick: function (e, row) {\n                                    //e - the click event object\n                                    //row - row component\n                                },\n                                rowDblClick: function (e, row) {\n                                    //e - the click event object\n                                    //row - row component\n                                },\n                                rowContext: function (e, row) {\n                                    //e - the click event object\n                                    //row - row component\n\n                                    e.preventDefault(); // prevent the browsers default context menu form appearing.\n                                },\n                                rowTap: function (e, row) {\n                                    //e - the tap event object\n                                    //row - row component\n                                },\n                                rowDblTap: function (e, row) {\n                                    //e - the tap event object\n                                    //row - row component\n                                },\n                                rowTapHold: function (e, row) {\n                                    //e - the tap event object\n                                    //row - row component\n                                },\n                                rowMouseEnter: function (e, row) {\n                                    //e - the event object\n                                    //row - row component\n                                },\n                                rowMouseLeave: function (e, row) {\n                                    //e - the event object\n                                    //row - row component\n                                },\n                                rowMouseOver: function (e, row) {\n                                    //e - the event object\n                                    //row - row component\n                                },\n                                rowMouseOut: function (e, row) {\n                                    //e - the event object\n                                    //row - row component\n                                },\n                                rowMouseMove: function (e, row) {\n                                    //e - the event object\n                                    //row - row component\n                                },\n                                rowAdded: function (row) {\n                                    //row - row component\n                                },\n                                rowUpdated: function (row) {\n                                    //row - row component\n                                },\n                                rowDeleted: function (row) {\n                                    //row - row component\n                                },\n                                rowMoved: function (row) {\n                                    //row - row component\n                                },\n                                rowResized: function (row) {\n                                    //row - row component of the resized row\n                                }\n                            }";
            break;

          case 'cellCallback':
            string = "{\n                                cellClick: function (e, cell) {\n                                    //e - the click event object\n                                    //cell - cell component\n                                },\n                                cellDblClick: function (e, cell) {\n                                    //e - the click event object\n                                    //cell - cell component\n                                },\n                                cellContext: function (e, cell) {\n                                    //e - the click event object\n                                    //cell - cell component\n                                },\n                                cellTap: function (e, cell) {\n                                    //e - the tap event object\n                                    //cell - cell component\n                                },\n                                cellDblTap: function (e, cell) {\n                                    //e - the tap event object\n                                    //cell - cell component\n                                },\n                                cellTapHold: function (e, cell) {\n                                    //e - the tap event object\n                                    //cell - cell component\n                                },\n                                cellMouseEnter: function (e, cell) {\n                                    //e - the event object\n                                    //cell - cell component\n                                },\n                                cellMouseLeave: function (e, cell) {\n                                    //e - the event object\n                                    //cell - cell component\n                                },\n                                cellMouseOver: function (e, cell) {\n                                    //e - the event object\n                                    //cell - cell component\n                                },\n                                cellMouseOut: function (e, cell) {\n                                    //e - the event object\n                                    //cell - cell component\n                                },\n                                cellMouseMove: function (e, cell) {\n                                    //e - the event object\n                                    //cell - cell component\n                                },\n                                cellEditing: function (cell) {\n                                    //cell - cell component\n                                },\n                                cellEditCancelled: function (cell) {\n                                    //cell - cell component\n                                },\n                                cellEdited: function (cell) {\n                                    //cell - cell component\n                                }\n                            }";
            break;

          case 'dataCallback':
            string = "{\n                                dataLoading: function(data) {\n                                    //data - the data loading into the table\n                                },\n                                dataLoaded: function(data) {\n                                    //data - all data loaded into the table\n                                },\n                                dataEdited: function(data) {\n                                    //data - the updated table data\n                                },\n                                htmlImporting: function() {},\n                                htmlImported: function() {}\n                            }";
            break;

          case 'filterCallback':
            string = "{\n                                dataFiltering:function(filters){\n                                    //filters - array of filters currently applied\n                                },\n                                dataFiltered:function(filters, rows){\n                                    //filters - array of filters currently applied\n                                    //rows - array of row components that pass the filters\n                                }\n                            }";
            break;

          case 'sortingCallback':
            string = "{\n                                dataSorting: function (sorters) {\n                                    //sorters - an array of the sorters currently applied\n                                },\n                                dataSorted: function (sorters, rows) {\n                                    //sorters - array of the sorters currently applied\n                                    //rows - array of row components in their new order\n                                }\n                            }";
            break;

          case 'layoutCallback':
            string = "{\n                                renderStarted: function () {},\n                                renderComplete: function () {}\n                            }";
            break;

          case 'paginationCallback':
            string = "{\n                                pageLoaded: function (pageno) {\n                                    //pageno - the number of the loaded page\n                                }\n                            }";
            break;

          case 'selectionCallback':
            string = "{\n                                rowSelected: function (row) {\n                                    //row - row component for the selected row\n                                },\n                                rowDeselected: function (row) {\n                                    //row - row component for the deselected row\n                                },\n                                rowSelectionChanged: function (data, rows) {\n                                    //rows - array of row components for the selected rows in order of selection\n                                    //data - array of data objects for the selected rows in order of selection\n                                }\n                            }";
            break;

          case 'rowMovementCallback':
            string = "{\n                                movableRowsSendingStart: function (toTables) {\n                                    //toTables - array of receiving table elements\n                                },\n                                movableRowsSent: function (fromRow, toRow, toTable) {\n                                    //fromRow - the row component from the sending table\n                                    //toRow - the row component from the receiving table (if available)\n                                    //toTable - the Tabulator object for the receiving table\n                                },\n                                movableRowsSentFailed: function (fromRow, toRow, toTable) {\n                                    //fromRow - the row component from the sending table\n                                    //toRow - the row component from the receiving table (if available)\n                                    //toTable - the Tabulator object for the receiving table\n                                },\n                                movableRowsSendingStop: function (toTables) {\n                                    //toTables - array of receiving table Tabulator objects\n                                },\n                                movableRowsReceivingStart: function (fromRow, fromTable) {\n                                    //fromRow - the row component from the sending table\n                                    //fromTable - the Tabulator object for the sending table\n                                },\n                                movableRowsReceived: function (fromRow, toRow, fromTable) {\n                                    //fromRow - the row component from the sending table\n                                    //toRow - the row component from the receiving table (if available)\n                                    //fromTable - the Tabulator object for the sending table\n                                },\n                                movableRowsReceivedFailed: function (fromRow, toRow, fromTable) {\n                                    //fromRow - the row component from the sending table\n                                    //toRow - the row component from the receiving table (if available)\n                                    //fromTable - the Tabulator object for the sending table\n                                },\n                                movableRowsReceivingStop: function (fromTable) {\n                                    //fromTable - the Tabulator object for the sending table\n                                }\n                            }";
            break;

          case 'validationCallback':
            string = "{\n                                validationFailed: function (cell, value, validators) {\n                                    //cell - cell component for the edited cell\n                                    //value - the value that failed validation\n                                    //validatiors - an array of validator objects that failed\n                                }\n                            }";
            break;

          case 'historyCallback':
            string = "{\n                                historyUndo: function (action, component, data) {\n                                    //action - the action that has been undone\n                                    //component - the Component object afected by the action (colud be a row or cell component)\n                                    //data - the data being changed\n                                },\n                                historyRedo: function (action, component, data) {\n                                    //action - the action that has been redone\n                                    //component - the Component object afected by the action (colud be a row or cell component)\n                                    //data - the data being changed\n                                }\n                            }";
            break;

          case 'clipboardCallback':
            string = "{\n                                clipboardCopied: function (clipboard) {\n                                    //clipboard - the string that has been copied into the clipboard\n                                },\n                                clipboardPasted: function (clipboard, rowData, rows) {\n                                    //clipboard - the clipboard string\n                                    //rowData - the row data from the paste parser\n                                    //rows - the row components from the paste action (this will be empty if the \"replace\" action is used)\n                                },\n                                clipboardPasteError: function (clipboard) {\n                                    //clipboard - the clipboard string that was rejected by the paste parser\n                                }\n                            }";
            break;

          case 'downloadCallback':
            string = "{\n                                downloadDataFormatter: function (data) {\n                                    //data - active table data array\n\n                                    data.forEach(function (row) {\n                                        row.age = row.age >= 18 ? \"adult\" : \"child\";\n                                    });\n\n                                    return data;\n                                },\n                                downloadReady: function (fileContents, blob) {\n                                    //fileContents - the unencoded contents of the file\n                                    //blob - the blob object for the download\n\n                                    //custom action to send blob to server could be included here\n\n                                    return blob; //must return a blob to proceed with the download, return false to abort download\n                                },\n                                downloadComplete: function () {}\n                            }";
            break;

          case 'dataTreeCallback':
            string = "{\n                                dataTreeRowExpanded: function (row, level) {\n                                    //row - the row component for the expanded row\n                                    //level - the depth of the row in the tree\n                                },\n                                dataTreeRowCollapsed: function (row, level) {\n                                    //row - the row component for the collapsed row\n                                    //level - the depth of the row in the tree\n                                }\n                            }";
            break;

          case 'scrollingCallback':
            string = "{\n                                scrollVertical: function (top) {\n                                    //top - the current vertical scroll position\n                                },\n                                scrollHorizontal: function (left) {\n                                    //left - the current horizontal scroll position\n                                }\n                            }";
            break;

          default:
            string = "{}";
            break;
        }

        return string;
      }; // This is where it all started


      self.tabulator.setValue = function ($form, type, reset) {
        // eslint-disable-next-line no-undef
        var beautify = ace.require('ace/ext/beautify');

        var existsObject = {};
        type.forEach(function (val, i, arr) {
          var strings = self.tabulator.callbackStrings(val); // Set Worker to be false to disable error highlighting

          self[val].editor.session.setUseWorker(false); // Store to cache for comparison check

          self.tabulator.editorCache(val, strings); // eslint-disable-next-line no-undef

          if (object[val] && Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).length > 0 && !reset) {
            // eslint-disable-next-line no-undef
            var obj = JSONfn.parse(self.tabulator.convertJSONFunction(strings)); // Restart Table
            // eslint-disable-next-line no-undef

            existsObject = Object.assign({}, existsObject, JSONfn.parse(object[val].code)); // Change on cache if its match

            var _loop3 = function _loop3(key) {
              // eslint-disable-next-line no-undef
              if (obj.hasOwnProperty(key)) {
                // eslint-disable-next-line no-undef
                var objectKey = Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).filter(function (val, i) {
                  return val === key;
                })[0]; // eslint-disable-next-line no-undef

                var objectFunc = JSONfn.parse(object[val].code)[key];

                if (objectKey === key) {
                  self.tabulator.cache[val] = self.tabulator.cache[val].map(function (cacheObj, i, arr) {
                    if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                      return _defineProperty({}, key, objectFunc);
                    } else {
                      return cacheObj;
                    }
                  });
                  self.tabulator.originalCache[val] = self.tabulator.originalCache[val].map(function (cacheObj, i, arr) {
                    if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                      return _defineProperty({}, key, objectFunc);
                    } else {
                      return cacheObj;
                    }
                  }); // Change on string later (TODO)
                  // eslint-disable-next-line no-undef

                  var editorStringObj = JSONfn.parse(self.tabulator.convertJSONFunction(strings));

                  for (var editorKey in editorStringObj) {
                    if (editorStringObj.hasOwnProperty(editorKey)) {
                      if (editorKey === key) {
                        editorStringObj[editorKey] = objectFunc;
                      }
                    }
                  } // eslint-disable-next-line no-undef


                  self[val].editor.session.setValue(self.tabulator.convertToString(editorStringObj)); // Beautify it back

                  beautify.beautify(self[val].editor.session);
                }
              }
            };

            for (var key in obj) {
              _loop3(key);
            }
          } else {
            // Set Value to Editor after checking the exists object
            self[val].editor.session.setValue(strings); // Beautify the Javascript Object in Editor

            beautify.beautify(self[val].editor.session);
          } // Apply on change events (Must trigger last!)


          self.tabulator.events(val); // End Set Value
        }); // End loop

        if (Object.getOwnPropertyNames(existsObject).length > 0) {
          self.tabulator.restartTableCallback(existsObject);
        }
      }; // End Custom Code Editor Extends

    };
  }
});

}).call(this,require("timers").setImmediate)
},{"timers":2}]},{},[3]);
