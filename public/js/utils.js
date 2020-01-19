(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-redeclare */

/* eslint-disable no-var */

/* eslint-disable no-undef */
apos.define('dynamic-table-utils', {
  afterConstruct: function afterConstruct(self) {
    // To let others extend it
    self.allListener();
  },
  construct: function construct(self, options) {
    // options.schemas && options.object receives whenever dynamic-table-widgets-editor available
    if (options.jQuery) {
      self.jQuery = options.jQuery;
    }

    self.tableDelimiter = options.tableDelimiter ? options.tableDelimiter : ',';
    self.tableEscapeChar = options.tableEscapeChar;
    self.tabulator = {
      options: Object.assign({}, self.tabulator ? self.tabulator.options : {}, options.tabulator),
      table: null,
      callbacks: Object.assign({}, self.tabulator ? self.tabulator.callbacks : {}, options.callbacks ? JSONfn.parse(options.callbacks) : {})
    };
    self.exists = false;

    self.tabulator.callbackStrings = function (editorType) {
      var strings = '';

      if (Object.getOwnPropertyNames(self.tabulator.callbacks).length > 0) {
        strings = typeof self.tabulator.callbacks[editorType] !== 'string' ? apos.customCodeEditor.tabulator.convertToString(self.tabulator.callbacks[editorType]) : self.tabulator.callbacks[editorType];
      } else {
        strings = '{}';
      }

      return strings;
    };

    self.updateRowsAndColumns = function (object) {
      if (object) {
        self.rowData = object.data;
        self.columnData = object.columns;
        self.executeRow(self.rowData.length);
        self.executeColumn(self.columnData.length);
      }

      self.dataToArrayOfObjects();

      if (self.rowData.length > 0 && self.columnData.length > 0) {
        apos.schemas.findField(self.$form, 'row').val(self.rowData.length);
        apos.schemas.findField(self.$form, 'column').val(self.columnData.length);
      }
    };

    self.resetCustomTable = function () {
      var rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');
      var dataInput = apos.schemas.findFieldset(self.$form, 'data').find('textarea');

      if (dataInput.length > 0 && dataInput.val().length > 0) {
        dataInput.val('');
      }

      if (rowInput.length > 0 && rowInput.val().length > 0) {
        rowInput.val('');
      }

      if (columnInput.length > 0 && columnInput.val().length > 0) {
        columnInput.val('');
        columnInput.attr('disabled', true);
      }
    };

    self.resetAjaxTable = function () {
      var ajaxURL = apos.schemas.findFieldset(self.$form, 'ajaxURL').find('input');

      if (ajaxURL.val().length > 0) {
        ajaxURL.val('');
      }
    };

    self.beforeShowDynamicTable = function ($form, data) {
      // Reset rows & columns
      self.resetDataOptions(); // Get the form DOM

      self.$form = $form; // Can access self.$el & self.$form in here

      self.$row = apos.schemas.findFieldset(self.$form, 'row');
      self.$column = apos.schemas.findFieldset(self.$form, 'column');
      self.$data = apos.schemas.findFieldset(self.$form, 'data');
      self.$tableHTML = self.$form.find('#dynamicTable');
      self.$ajaxURL = apos.schemas.findFieldset(self.$form, 'ajaxURL');
      self.$divTable = self.$form.find('.dynamic-table-area');
      self.$id = apos.schemas.findFieldset(self.$form, 'id');
      self.$url = apos.schemas.findFieldset(self.$form, 'url');
      self.$title = apos.schemas.findFieldset(self.$form, 'title');
      self.$callbacks = apos.schemas.findFieldset(self.$form, 'callbacks');
      self.$id.val(data.id);
      this.link('apos', 'resetCallbacks', self.resetCallbacks);
      var rowInput = self.$row.find('input');
      var columnInput = self.$column.find('input');
      var dataInput = self.$data.find('textarea');
      var ajaxURL = self.$ajaxURL.find('input'); // Destroy table if exists

      self.destroyTable(); // Disabled first by default

      if (rowInput.length > 0 && rowInput.val().length < 1) {
        columnInput.attr('disabled', true);
      }

      self.$row.on('change', function (e) {
        var num = parseInt(e.currentTarget.querySelector('input').value);

        if (ajaxURL.val().length > 0) {
          var confirm = window.confirm('You are about to remove your Ajax Input from being used. Are you sure you want to continue ?');

          if (confirm) {
            ajaxURL.val('');
            self.resetAjaxTable();
            self.executeRow(num);
          }
        } else {
          self.executeRow(num);
        }
      });
      self.$column.on('change', function (e) {
        var num = parseInt(e.currentTarget.querySelector('input').value);
        self.executeColumn(num);
      });
      self.$ajaxURL.on('change', function (e) {
        var options = e.currentTarget.querySelector('input').value;
        self.executeAjax(options);
      });
      self.$data.on('change', function (e) {
        try {
          var _data = JSON5.parse(e.currentTarget.querySelector('textarea').value); // Auto Convert Columns Title


          _data.columns = _data.columns.map(function (item, i) {
            if (self.columnData[i] && self.columnData[i].title && item.title !== self.columnData[i].title && item.title && item.sTitle) {
              // Adjust Title
              item.sTitle = item.title;
            } else if (self.columnData[i] && self.columnData[i].sTitle && item.sTitle !== self.columnData[i].sTitle && item.sTitle && item.title) {
              // Adjust Title
              item.title = item.sTitle;
            }

            return item;
          });
          self.updateRowsAndColumns(_data); // Update to inputs

          if (rowInput.length > 0) {
            rowInput.val(_data.data.length);
          }

          if (columnInput.length > 0) {
            columnInput.val(_data.columns.length);
          }

          self.executeRow(_data.data.length);
          self.executeColumn(_data.columns.length);
          self.initTable();
        } catch (e) {
          console.warn(e);
        }
      });
    };

    self.afterShowDynamicTable = function ($form, data) {
      self.$form = $form; // Let everything running on `beforeShow` above and other functions that might needed to run
      // Then call this function to run when everything is populated

      var rowInput = self.$row.find('input');
      var columnInput = self.$column.find('input');
      var ajaxURL = self.$ajaxURL.find('input');
      var dataInput = self.$data.find('textarea');
      var idInput = self.$id.find('input');
      self.$chooser = apos.schemas.findFieldset(self.$form, '_dynamicTable').data('aposChooser');
      idInput.val(data.id); // Let change event registered first, then trigger it

      if (rowInput.length > 0 && columnInput.length > 0 && ajaxURL.length > 0 && rowInput.val().length > 0 && columnInput.val().length > 0 && ajaxURL.val().length === 0) {
        self.updateRowsAndColumns(JSON5.parse(dataInput.val()));
        self.initTable();
      }

      if (ajaxURL.length > 0 && ajaxURL.val().length > 0) {
        // To enable textarea auto resize
        self.$ajaxURL.trigger('change');
      }

      if (idInput.length > 0 && idInput.val().length === 0) {
        idInput.val(data ? data._id : '');
      }

      if (self.$chooser) {
        self.getJoin(self.$chooser);
      } // Run Custom Code Editor for Dynamic Table


      if (apos.customCodeEditor.tabulator && this.__meta.name !== 'dynamic-table-widgets-editor') {
        // For Callback
        self.setCallbacksValue();
      }
    };

    self.executeAjax = function (options) {
      if (self.tabulator.table) {
        self.destroyTable();
      } // Reset Data


      self.rowData = [];
      self.columnData = [];

      if (options !== (null || undefined)) {
        self.tabulator.options = Object.assign({}, self.tabulator.options, {
          ajaxURL: typeof options === 'string' ? options : options.ajaxURL
        });
      }

      self.resetCustomTable();
      self.initTable();
    };

    self.resetAjaxTable = function () {
      self.tabulator.options.ajaxURL = undefined;
    };

    self.restartTable = function () {
      // Restart Table
      if (self.tabulator.options.ajaxURL) {
        // If Ajax enabled, just reload the table
        self.destroyTable();
        self.initTable();
      } else {
        // Restart normal custom table
        self.initTable();
      }
    };

    self.resetCallbacksOptions = function () {
      var schemaCallbacks = self.tabulator.schemas.filter(function (val) {
        return val.name === 'callbacks';
      })[0].choices.reduce(function (init, next, i, arr) {
        return Object.assign({}, init, JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(self.tabulator.callbackStrings(next.showFields[0]))));
      }, {});

      for (var key in self.tabulator.options) {
        if (self.tabulator.options.hasOwnProperty(key)) {
          if (schemaCallbacks[key]) {
            delete self.tabulator.options[key];
          }
        }
      } // Restart Table


      self.restartTable(); // Reset Callbacks Value

      self.setCallbacksValue(true);
    };

    self.resetCallbacks = function () {
      return self.resetCallbacksApi({
        id: self.$id.val() || ''
      }, function (err) {
        if (err) {
          apos.utils.warn('Unable to reset callbacks', err);
          apos.notify('Oops ! Something went wrong!', {
            dismiss: true,
            type: 'error'
          });
          return;
        }

        self.resetCallbacksOptions();
        return apos.notify('Callbacks Reset! Please save your table to confirm reset.', {
          type: 'success'
        });
      });
    };

    self.loadLeanDataTables = function (xhr) {
      var constructorDatatable = this;

      if (constructorDatatable.options.ajax && constructorDatatable.options.ajax.dataSrc && constructorDatatable.options.ajax.dataSrc.length > 0 && constructorDatatable.options.ajax.dataSrc !== '') {
        var data = JSON.findNested(constructorDatatable.options.ajax.dataSrc, JSON.parse(xhr.responseText));
      } else {
        // eslint-disable-next-line no-redeclare
        var data = JSON.parse(xhr.responseText);
      }

      var convertData = []; // Loop over the data and style any columns with numbers

      for (var i = 0; i < data.length; i++) {
        var _loop = function _loop(property) {
          // If options.columns
          if (constructorDatatable.options.columns) {
            var filter = constructorDatatable.options.columns.filter(function (val) {
              return val.data.includes(property);
            });

            if (filter.length > 0) {
              for (var columns = 0; columns < constructorDatatable.options.columns.length; columns++) {
                var getDataPos = constructorDatatable.options.columns[columns].data;
                var getTitle = constructorDatatable.options.columns[columns].title;

                if (getDataPos.split('.').length > 1 && getDataPos.includes(property)) {
                  // First match if nested object found
                  convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = _defineProperty({}, getTitle, !window.isNaN(self.findNested(getDataPos, data[i])) ? self.findNested(getDataPos, data[i]).toString() : self.findNested(getDataPos, data[i])));
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
    }; // Thanks to Stephen Wagner (https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript)


    self.textareaAutoResize = function (element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
    };

    self.executeAutoResize = function (element) {
      var offset = element.offsetHeight - element.clientHeight;
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + offset + 'px';
    }; // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f


    self.findNested = function (path, data) {
      if (Array.isArray(path)) {
        path = path.join('.');
      }

      return path.split('.').reduce(function (xs, x) {
        return xs && xs[x] ? xs[x] : null;
      }, data);
    };

    self.executeRow = function (value) {
      var isNaN = window.isNaN(value);
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');

      if (!isNaN && value !== 0) {
        if (columnInput.length > 0 && columnInput.attr('disabled') === 'disabled') {
          columnInput.attr('disabled', false);
        }

        if (self.rowData.length > 0) {
          self.rowData = self.rowData.slice(0, value);
        } // Append Rows


        for (var i = 0; i < value; i++) {
          if (self.rowData[i]) {
            continue;
          }

          self.rowData.push([]);
        } // Trigger change to update value based on active row input


        if (columnInput.val().length > 0) {
          apos.schemas.findFieldset(self.$form, 'column').trigger('change');
        }
      }

      if (value === 0) {
        if (columnInput.length > 0) {
          columnInput.attr('disabled', true);
        }

        self.destroyTable();
      }
    };

    self.executeColumn = function (value) {
      var isNaN = window.isNaN(value);
      var rowInput = apos.schemas.findFieldset(self.$form, 'row').find('input');
      var columnInput = apos.schemas.findFieldset(self.$form, 'column').find('input');

      if (!isNaN && value !== 0) {
        if (self.columnData.length > 0) {
          self.columnData = self.columnData.slice(0, value);
        } // Loop each row to append new data to it


        for (var a = 0; a < value; a++) {
          if (self.columnData[a]) {
            continue;
          }

          self.columnData.push({
            title: 'header' + (a + 1)
          });
        } // Reupload data to column change


        for (var row = 0; row < self.rowData.length; row++) {
          for (var column = 0; column < self.columnData.length; column++) {
            if (self.rowData[row][column]) {
              continue;
            }

            self.rowData[row].push('untitled');
          } // Delete unecessary rows data based on columns


          if (self.rowData[row].length !== self.columnData.length) {
            // apos.notify(`Error : Number of rows isn't based on number of columns. Row ${row} affected`, {
            //     type: 'error',
            //     dismiss: true
            // })
            self.rowData[row] = self.rowData[row].slice(0, self.columnData.length);
          }
        }

        self.updateRowsAndColumns();

        if (self.columnData.length > 0) {
          self.initTable();
        }
      }

      if (value === 0) {// Nothing here yet
      }
    }; // Change all data to array of objects


    self.dataToArrayOfObjects = function () {
      // Loop over row to determine its value
      for (var row = 0; row < self.rowData.length; row++) {
        // Loop over column to determine its property
        for (var column = 0; column < self.columnData.length; column++) {
          self.rowsAndColumns[row] = Object.assign(self.rowsAndColumns[row] || {}, _defineProperty({}, self.columnData[column].title, self.rowData[row][column]));
        } // Run checking column


        if (Object.keys(self.rowsAndColumns[row]).length !== self.columnData.length) {
          Object.keys(self.rowsAndColumns[row]).forEach(function (val, i) {
            var filter = self.columnData.filter(function (value, index) {
              return value.title === val;
            });

            if (filter.length === 0) {
              delete self.rowsAndColumns[row][val];
            }
          });
        }
      } // Run Checking Rows


      if (self.rowsAndColumns.length !== self.rowData.length) {
        self.rowsAndColumns = self.rowsAndColumns.slice(0, self.rowData.length);
      }
    };

    self.initTable = function () {
      if (self.tabulator.table) {
        // Clear Data and setData again
        self.tabulator.table.clearData();
        self.tabulator.table.setData(self.rowsAndColumns);
      } else {
        // Refresh Existing Table
        self.$tableHTML = self.$form.find('table#dynamicTable'); // Safe method. Table may display many

        self.$tableHTML.each(function (i, val) {
          // When table is visible
          if (val.offsetParent !== null) {
            // If Ajax enable, disable custom row and column data
            if (self.tabulator.options.ajaxURL && self.rowData.length === 0 && self.columnData.length === 0) {
              var table = new Tabulator(self.$tableHTML[i], self.tabulator.options);
              self.tabulator.table = table;
            } else {
              if (self.tabulator.options.ajaxURL) {
                self.resetAjaxTable();
              }

              var table = new Tabulator(self.$tableHTML[i], Object.assign({}, self.tabulator.options, {
                columns: self.columnData
              }));
              self.tabulator.table = table;
              table.setData(self.rowsAndColumns);
            }
          }
        });
      } // Register any DataTablesJS Event


      self.registerTableEvent(self.tabulator.table); // For Schema Auto Insert

      if (self.rowData.length !== 0 && self.columnData.length !== 0) {
        self.convertData();
      }
    };

    self.destroyTable = function () {
      // Reset options
      self.resetDataOptions();

      if (self.tabulator.table) {
        // Get parent element and append new table from cloneNode to overcome bug issue
        if (self.tabulator.options.ajaxURL && self.rowData.length === 0 && self.columnData.length === 0) {
          var parentTable = self.tabulator.table.element.parentElement;
          self.tabulator.table.destroy();
          self.tabulator.table = null;
          $(parentTable).empty();
          $(parentTable).append(apos.schemas.tabulator.getTable.cloneNode());
        } else {
          self.tabulator.table.destroy();
          self.tabulator.table = null;
        }
      } // Refresh Existing Table


      self.$tableHTML = self.$form.find('table#dynamicTable');
    };

    self.resetDataOptions = function () {
      self.rowData = [];
      self.columnData = [];
      self.rowsAndColumns = [];
    };

    self.convertData = function () {
      var convertData = apos.schemas.findFieldset(self.$form, 'data').find('textarea');

      if (convertData.length > 0) {
        convertData.val(JSON5.stringify({
          data: self.rowData,
          columns: self.columnData
        }, {
          space: 2
        }));
        self.executeAutoResize(convertData.get(0));
      }
    };

    self.getFieldsApi = function (query, callback) {
      return $.get('/modules/dynamic-table/get-fields', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.resetCallbacksApi = function (query, callback) {
      return apos.modules['dynamic-table'].api('reset-callbacks', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.updateFieldsApi = function (query, callback) {
      return apos.modules['dynamic-table'].api('update-fields', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.removeUrlsApi = function (query, callback) {
      return apos.modules['dynamic-table'].api('remove-urls', query, function (data) {
        if (data.status === 'success') {
          return callback(null, data.message);
        }

        return callback(data.message);
      });
    };

    self.getResultAndInitTable = function (ajaxResult) {
      // Loop ajaxResult object
      for (var _i = 0, _Object$keys = Object.keys(ajaxResult); _i < _Object$keys.length; _i++) {
        var property = _Object$keys[_i];

        if (ajaxResult.hasOwnProperty(property)) {
          switch (property) {
            case 'ajaxURL':
              try {
                self.executeAjax(ajaxResult[property]);
              } catch (e) {// Leave the error alone
              }

              break;

            case 'data':
              try {
                self.updateRowsAndColumns(JSON5.parse(ajaxResult[property])); // Start the table

                self.initTable();
              } catch (e) {// Leave the error alone
              }

              break;
          }
        }
      }
    };

    self.beforeSave = function (callback) {
      // Should always return callback null. Because if you put an error to it, it will never be save.
      // We don't want that
      if (self.getChoiceId !== self.getNewChoiceId && self.getNewChoiceId) {
        // Update previous piece
        return self.removeUrlsApi({
          id: self.getChoiceId,
          url: window.location.pathname
        }, function (err) {
          if (err) {
            apos.utils.warn('Cannot remove url on previous piece');
          } // Update latest piece


          return self.updateFieldsApi({
            id: self.getNewChoiceId,
            url: window.location.pathname
          }, function (err) {
            if (err) {
              apos.utils.warn('Unable to update new piece save');
              return callback(null);
            } // reset choice value


            self.getChoiceId = self.getNewChoiceId;
            return callback(null);
          });
        });
      } else if (self.getNewChoiceId && !self.getChoiceId) {
        // Update latest piece
        return self.updateFieldsApi({
          id: self.getNewChoiceId,
          url: window.location.pathname
        }, function (err) {
          if (err) {
            apos.utils.warn('Unable to update new piece save');
            return callback(null);
          } // reset choice value


          self.getChoiceId = self.getNewChoiceId;
          return callback(null);
        });
      }

      $(self["float"]).remove();
      return callback(null);
    };

    self.allListener = function () {
      apos.on('widgetTrashed', function ($widget) {
        if ($widget.data() && $widget.data().aposWidget === 'dynamic-table') {
          var pieceId = apos.modules['dynamic-table-widgets'].getData($widget).dynamicTableId;
          self.removeUrlsApi({
            id: pieceId,
            url: window.location.pathname
          }, function (err) {
            if (err) {
              return apos.utils.warn('Unable to remove widget location.');
            }

            return apos.utils.log('Successful remove widget location.');
          });
        }
      });
    };

    self.getJoin = function ($chooser) {
      var superAfterManagerSave = $chooser.afterManagerSave;
      var superAfterManagerCancel = $chooser.afterManagerCancel;
      self.getChoiceId = undefined;
      self.getNewChoiceId = undefined; // Destroy table and its options first to avoid DataTablesJQuery Problem

      self.destroyTable();

      if ($chooser.choices.length > 0) {
        self.getChoiceId = $chooser.choices[0].value;
      }

      if (self.getChoiceId) {
        // Get fields first and start
        self.getFieldsApi({
          id: self.getChoiceId
        }, function (err, result) {
          if (err) {
            // Reset self.getChoiceId
            self.getChoiceId = undefined;
            return apos.utils.warn('Unable to get the table piece. Are you sure it saves correctly ?');
          }

          return self.getResultAndInitTable(result);
        });
      }

      $chooser.afterManagerSave = function () {
        superAfterManagerSave(); // Refresh Form

        self.$form = $chooser.$choices.parent().parent().parent();
        self.getNewChoiceId = $chooser.choices[0].value; // Destroy table before reinitialization

        self.destroyTable(); // Get field first

        return self.getFieldsApi({
          id: self.getNewChoiceId
        }, function (err, result) {
          if (err) {
            return apos.utils.warn('Dynamic Table Piece not found');
          }

          return self.getResultAndInitTable(result);
        });
      };

      $chooser.afterManagerCancel = function () {
        superAfterManagerCancel();
        self.destroyTable();

        if ($chooser.choices.length > 0) {
          self.getChoiceId = $chooser.choices[0].value;
          return self.getFieldsApi({
            id: self.getChoiceId
          }, function (err, result) {
            if (err) {
              return apos.utils.warn('Dynamic Table Piece not found');
            }

            return self.getResultAndInitTable(result);
          });
        }
      };
    }; // Any table event is allowed


    self.registerTableEvent = function ($table) {};

    self.setCallbacksValue = function (reset) {
      if (reset) {
        return apos.customCodeEditor.tabulator.setValue(self.$form, apos.schemas.tabulator.schema.filter(function (val) {
          return val.name === 'callbacks';
        })[0].choices.reduce(function (init, next, i, arr) {
          return init.concat(next.value + 'Callback');
        }, []), reset);
      } else {
        return apos.customCodeEditor.tabulator.setValue(self.$form, apos.schemas.tabulator.schema.filter(function (val) {
          return val.name === 'callbacks';
        })[0].choices.reduce(function (init, next, i, arr) {
          return init.concat(next.value + 'Callback');
        }, []));
      }
    };

    self.changeTabRebuildTable = function (element, tab) {
      if (self.$ajaxURL.find('input').val().length > 0 && self.rowData.length === 0 && self.columnData.length === 0) {
        // Pass extra arguments for specific table element when change tab
        self.executeAjax(self.tabulator.options);
      } else if (self.$ajaxURL.find('input').val().length === 0 && self.rowData.length > 0 && self.columnData.length > 0) {
        if (self.tabulator.options.ajaxURL) {
          self.resetAjaxTable();
        }

        var table = new Tabulator(element.querySelector('table'), Object.assign({}, self.tabulator.options, {
          columns: self.columnData
        }));
        self.tabulator.table = table;
        self.tabulator.table.setData(self.rowsAndColumns);
      } // Apply Event


      self.registerTableEvent(table); // Only on callbacks tab clicked

      if (tab.data().aposOpenGroup === 'callbacks') {
        if (self["float"]) {
          $(self["float"]).css('display', 'block');
        }
      } else {
        if (self["float"]) {
          $(self["float"]).css('display', 'none');
        }
      }
    }; // To always send the data that has schema type of array


    self.arrayFieldsArrange = function (arrayItems, fieldName) {
      // Just pass the array items from rowData & columnData
      var config = {
        delimiter: self.tableDelimiter
      };

      if (self.tableEscapeChar) {
        config.escapeChar = self.tableEscapeChar;
      }

      switch (fieldName) {
        case 'adjustRow':
          for (var row = 0; row < self.rowData.length; row++) {
            // Always replace value and re-edit id
            arrayItems[row] = {
              id: apos.utils.generateId(),
              rowContent: Papa.unparse(self.rowData, {
                newLine: '\r\n',
                quotes: true
              }).split('\r\n').map(function (val) {
                return val.replace(/(",")/g, '|').replace(/(^")|("$)/g, '').replace(/,/g, '","').replace(/\|/g, ',');
              })[row]
            }; // Chaining replace due to Papa Unparse bug where '\",\"' is become ',' on very first row
            // While ',' is become '\",\"'
            // So in order to fix that, we have to replace so many string
          }

          break;

        case 'adjustColumn':
          for (var column = 0; column < self.columnData.length; column++) {
            arrayItems[column] = {
              id: apos.utils.generateId(),
              columnContent: self.columnData[column].title
            };
          }

          break;

        default:
          // eslint-disable-next-line no-self-assign
          arrayItems = arrayItems;
          break;
      }

      return arrayItems;
    };

    self.updateFromArrayFields = function (arrayItems, fieldName) {
      // Just pass the array items from rowData & columnData
      var config = {
        delimiter: self.tableDelimiter
      };

      if (self.tableEscapeChar) {
        config.escapeChar = self.tableEscapeChar;
      }

      switch (fieldName) {
        case 'adjustRow':
          for (var row = 0; row < arrayItems.length; row++) {
            // Tough parsing but it works !
            self.rowData[row] = Papa.parse(arrayItems[row].rowContent, {
              escapeChar: self.tableEscapeChar || '"',
              transform: function transform(value) {
                var store = value; // Replace the quote value to normal

                store = store.replace(new RegExp("\\\\([\\s\\S])|(".concat(self.tableEscapeChar || '"', ")"), 'g'), '$1');
                return store;
              }
            }).data[0];
          }

          break;

        case 'adjustColumn':
          for (var column = 0; column < arrayItems.length; column++) {
            self.columnData.map(function (value, i, arr) {
              // In Column, there will be an object, so loop it !
              for (var _i2 = 0, _Object$keys2 = Object.keys(value); _i2 < _Object$keys2.length; _i2++) {
                var property = _Object$keys2[_i2];

                if (value.hasOwnProperty(property)) {
                  // Make sure its on same array
                  if (i === column) {
                    value[property] = arrayItems[column].columnContent;
                  }
                }
              }

              return value;
            });
          }

          break;
      }

      if (self.rowData.length > 0 && self.columnData.length > 0) {
        // Update to make convert enabled
        self.updateRowsAndColumns();
      } // If no rowData and ColumnData at all, must be the ajax. If not, just do nothing


      if (self.$ajaxURL.find('input').val().length > 0 && self.rowData.length === 0 && self.columnData.length === 0) {
        self.$ajaxURL.trigger('change');
      }

      if (self.$ajaxURL.find('input').val().length === 0 && self.rowData.length > 0 && self.columnData.length > 0) {
        self.$ajaxURL.find('input').val('');
      }
    }; // End of Utils

  }
});

},{}]},{},[1]);
