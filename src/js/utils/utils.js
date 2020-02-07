/* global JSONfn, JSON5 */
import table from './sub-utils/table';
import callbacks from './sub-utils/callbacks';
import helpers from './sub-utils/helpers';
import dataManagement from './sub-utils/data-management';
import routes from './sub-utils/routes';
import events from './sub-utils/events';
import modal from './sub-utils/modal';
import downloads from './sub-utils/downloads';
import customOptions from './sub-utils/options';
import links from './sub-utils/links';
import load from './sub-utils/load';
apos.define('dynamic-table-utils', {
    afterConstruct: function (self) {
        // To let others extend it
        self.allListener();
    },
    construct: function (self, options) {
        self.options = options;
        // options.schemas && options.object receives whenever dynamic-table-widgets-editor available
        self.tableDelimiter = options.tableDelimiter ? options.tableDelimiter : ',';
        self.tableEscapeChar = options.tableEscapeChar;
        if (options.tabulator) {
            self.originalOptionsTabulator = options.tabulator;
        }

        self.tabulator = {
            options: Object.assign({}, self.tabulator ? self.tabulator.options : {}, options.tabulator),
            table: null,
            callbacks: Object.assign({}, self.tabulator ? self.tabulator.callbacks : {}, options.callbacks ? JSONfn.parse(options.callbacks) : {})
        }

        table(self, options);
        callbacks(self, options);
        helpers(self, options);
        dataManagement(self, options);
        routes(self, options);
        events(self, options);
        modal(self, options);
        downloads(self, options);
        customOptions(self, options);
        load(self, options);

        self.beforeShowDynamicTable = function ($form, data) {
            // Reset rows & columns
            self.resetDataOptions();
            // Get the form DOM
            self.$form = $form;
            // Can access self.$el & self.$form in here
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
            self.$options = apos.schemas.findFieldset(self.$form, 'tabulatorOptions');
            self.$id.val(data.id);

            links.call(this, self, options);

            let rowInput = self.$row.find('input');
            let columnInput = self.$column.find('input');
            let dataInput = self.$data.find('textarea');
            let ajaxURL = self.$ajaxURL.find('input');

            // Destroy table if exists
            self.destroyTable();

            // Disabled first by default
            if (rowInput.length > 0 && rowInput.val().length < 1) {
                columnInput.attr('disabled', true);
            }

            self.$row.on('change', function (e) {
                let num = parseInt(e.currentTarget.querySelector('input').value);
                if (ajaxURL.val().length > 0) {
                    let confirm = window.confirm('You are about to remove your Ajax Input from being used. Are you sure you want to continue ?');
                    if (confirm) {
                        ajaxURL.val('');
                        self.resetAjaxTable();
                        self.executeRow(num);
                    }
                } else {
                    self.executeRow(num);
                }
            })

            self.$column.on('change', function (e) {
                let num = parseInt(e.currentTarget.querySelector('input').value);
                self.executeColumn(num);
            })

            self.$ajaxURL.on('change', function (e) {
                let options = e.currentTarget.querySelector('input').value
                self.executeAjax(options);
            })

            self.$data.on('change', function (e) {
                try {
                    let data = JSON5.parse(e.currentTarget.querySelector('textarea').value);

                    // Auto Convert Columns Title
                    data.columns = data.columns.map(function (item, i) {
                        if (
                            self.columnData[i] &&
                            self.columnData[i].title &&
                            item.title !== self.columnData[i].title &&
                            item.title && item.sTitle
                        ) {
                            // Adjust Title
                            item.sTitle = item.title;

                        } else if (
                            self.columnData[i] &&
                            self.columnData[i].sTitle &&
                            item.sTitle !== self.columnData[i].sTitle &&
                            item.sTitle && item.title
                        ) {
                            // Adjust Title
                            item.title = item.sTitle;

                        }
                        return item;
                    });

                    self.updateRowsAndColumns(data);

                    // Update to inputs
                    if (rowInput.length > 0) {
                        rowInput.val(data.data.length);
                    }

                    if (columnInput.length > 0) {
                        columnInput.val(data.columns.length);
                    }
                    self.executeRow(data.data.length);
                    self.executeColumn(data.columns.length);

                    self.initTable();
                } catch (e) {
                    console.warn(e);
                }
            })
        }

        self.afterShowDynamicTable = function ($form, data) {
            self.$form = $form;
            // Let everything running on `beforeShow` above and other functions that might needed to run
            // Then call this function to run when everything is populated
            let rowInput = self.$row.find('input');
            let columnInput = self.$column.find('input');
            let ajaxURL = self.$ajaxURL.find('input');
            let dataInput = self.$data.find('textarea');
            let idInput = self.$id.find('input');
            self.$chooser = apos.schemas.findFieldset(self.$form, '_dynamicTable').data('aposChooser');
            idInput.val(data.id);

            // Let change event registered first, then trigger it
            if (
                rowInput.length > 0 &&
                columnInput.length > 0 &&
                ajaxURL.length > 0 &&
                rowInput.val().length > 0 &&
                columnInput.val().length > 0 &&
                ajaxURL.val().length === 0) {
                self.updateRowsAndColumns(JSON5.parse(dataInput.val()));
                self.initTable();
            }

            if (ajaxURL.length > 0 && ajaxURL.val().length > 0) {
                // To enable textarea auto resize
                self.$ajaxURL.trigger('change');
            }

            if (idInput.length > 0 && idInput.val().length === 0) {
                idInput.val(data ? data._id : '')
            }

            if (self.$chooser) {
                self.getJoin(self.$chooser);
            }

            // Run Custom Code Editor for Dynamic Table
            if (self.$callbacks.length > 0) {
                // For Callback
                self.setCallbacksValue();
            }

            // Options Comes Last
            if (self.$options.length > 0) {
                self.setOptionsValue();
            }
        }
        // End of Utils
    }
})