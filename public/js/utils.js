apos.define("dynamic-table-utils", {
    construct : function(self,options){
        // options.schemas && options.object receives whenever dynamic-table-widgets-editor available

        self.originalEditorDataTableOptions = options.editorDataTableOptions;

        self.exists = false;

        self.beforeShowDynamicTable = function($form , data){
            // Reset rows & columns
            self.rowData = [];
            self.columnData = [];
            // Get the form DOM
            self.$form = $form;
            // Can access self.$el & self.$form in here
            self.$row = apos.schemas.findFieldset(self.$form, "row");
            self.$column = apos.schemas.findFieldset(self.$form, "column");
            self.$data = apos.schemas.findFieldset(self.$form, "data");
            self.$tableHTML = self.$form.find("#dynamicTable");
            self.$ajaxOptions = apos.schemas.findFieldset(self.$form, "ajaxOptions");
            self.$divTable = self.$form.find(".dynamic-table-area");
            self.$id = apos.schemas.findFieldset(self.$form, "id");
            self.$url = apos.schemas.findFieldset(self.$form, "url");
            self.$title = apos.schemas.findFieldset(self.$form, "title");

            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            var dataInput = self.$data.find("textarea");
            var ajaxOptions = self.$ajaxOptions.find("textarea");

            // Register Textarea auto resize
            self.textareaAutoResize(dataInput.get(0));
            self.textareaAutoResize(ajaxOptions.get(0));

            // Disabled first by default
            if (rowInput.val().length < 1) {
                columnInput.attr("disabled", true);
            }

            self.$row.on("change", function (e) {
                var num = parseInt(e.currentTarget.querySelector("input").value);
                if (ajaxOptions.val().length > 0) {
                    var confirm = window.confirm("You are about to remove your Ajax Input from being used. Are you sure you want to continue ?");
                    if (confirm) {
                        // Remove ajax options
                        delete self.EditorDataTableOptions.ajax;
                        delete self.EditorDataTableOptions.columns;
                        delete self.EditorDataTableOptions.processed;
                        ajaxOptions.val("")
                        self.executeRow(num);
                    } else {
                        return;
                    }
                } else {
                    self.executeRow(num);
                }
            })


            self.$column.on("change", function (e) {
                var num = parseInt(e.currentTarget.querySelector("input").value);
                self.executeColumn(num);
            })

            self.$ajaxOptions.on("change", function (e) {
                try {
                    // Use custom JSON5 to beautifully parse the value without double quotes JSON
                    var options = JSON5.parse(e.currentTarget.querySelector("textarea").value);
                    self.executeAjax(options);
                } catch (e) {
                    console.warn(e);
                }
            })

            self.$data.on("change", function (e) {
                try {
                    var data = JSON5.parse(e.currentTarget.querySelector("textarea").value);

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

                        }
                        else if (
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

                    self.rowData = data.data;
                    self.columnData = data.columns;

                    // Update to options
                    self.EditorDataTableOptions.data = self.rowData;
                    self.EditorDataTableOptions.columns = self.columnData;

                    // Update to inputs
                    rowInput.val(data.data.length);
                    columnInput.val(data.columns.length);
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
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            var ajaxOptions = self.$ajaxOptions.find("textarea");
            var dataInput = self.$data.find("textarea");
            var idInput = self.$id.find("input");
            // Let change event registered first, then trigger it
            if (rowInput.val().length > 0 && columnInput.val().length > 0 && ajaxOptions.val().length === 0) {
                // Just trigger row change event
                self.$row.trigger("change");
            }

            if (ajaxOptions.val().length > 0) {
                // To enable textarea auto resize
                self.$ajaxOptions.trigger("change");
            }

            if(idInput.val().length === 0){
                idInput.val(data._id)
            }

            self.getTable();
        }

        self.mergeOptions = function(){
            self.EditorDataTableOptions = self.EditorDataTableOptions || {};
            Object.assign(self.EditorDataTableOptions , self.originalEditorDataTableOptions);
        }

        self.executeAjax = function (options) {
            self.destroyTable();
            delete self.EditorDataTableOptions.data;
            delete self.EditorDataTableOptions.columns;
            // Reset Data
            self.rowData = [];
            self.columnData = [];
            if (apos.assets.options.lean) {
                if (typeof options.ajax === "string") {
                    options.ajax = {
                        url: options.ajax
                    };
                }
                // Pass to load
                options.ajax.load = options.ajax.load || self.loadLeanDataTables;
            } else {
                // If switch to DataTablesJquery, delete this unnecessary options
                delete options.ajax.load;
                delete options.ajax.content;
            }
            // Merge Options
            Object.assign(self.EditorDataTableOptions, options);
            var rowInput = apos.schemas.findFieldset(self.$form, "row").find("input");
            var columnInput = apos.schemas.findFieldset(self.$form, "column").find("input");
            var dataInput = apos.schemas.findFieldset(self.$form, "data").find("textarea");
            dataInput.val("");
            rowInput.val("")
            columnInput.val("");
            columnInput.attr("disabled", true);
            self.initTable();
            return;
        }

        self.loadLeanDataTables = function (xhr) {
            if (
                options.ajax.dataSrc &&
                options.ajax.dataSrc.length > 0 &&
                options.ajax.dataSrc !== ""
            ) {
                var data = JSON.findNested(options.ajax.dataSrc, JSON.parse(xhr.responseText));
            } else {
                var data = JSON.parse(xhr.responseText);
            }
            var convertData = [];

            // Loop over the data and style any columns with numbers
            for (let i = 0; i < data.length; i++) {
                for (let property in data[i]) {
                    // If options.columns
                    if (options.columns) {
                        var filter = options.columns.filter((val, i) => val.data === property);
                        if (filter[0]) {
                            // If filter success
                            var getDataPos = filter[0].data;
                            var getTitle = filter[0].title
                            if (getDataPos.split(".").length > 1 && getDataPos.split(".")[getDataPos.split(".").length - getDataPos.split(".").length] === property) {
                                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                    [getTitle]: !window.isNaN(self.findNested(getDataPos, data[i][property])) ? self.findNested(getDataPos, data[i][property]).toString() : self.findNested(getDataPos, data[i][property])
                                })
                            } else {
                                convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                    [getTitle]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                                })
                            }
                        } else {
                            // If filter no success at all
                            convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                                [property]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                            })
                        }
                    } else {
                        // If no options.columns
                        convertData[i] = Object.assign(convertData[i] ? convertData[i] : convertData[i] = {}, convertData[i] = {
                            [property]: !window.isNaN(data[i][property]) ? data[i][property].toString() : data[i][property]
                        })
                    }
                }
            }

            // Data must return array of objects
            return JSON.stringify(convertData);
        }

        // Thanks to Stephen Wagner (https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript)
        self.textareaAutoResize = function (element) {
            element.style.boxSizing = 'border-box';
            var offset = element.offsetHeight - element.clientHeight;
            element.addEventListener('input', function (event) {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + offset + 'px';
            });
        }

        self.executeAutoResize = function (element) {
            var offset = element.offsetHeight - element.clientHeight;
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + offset + 'px';
        }

        // Thanks to Dinesh Pandiyan , Source : https://hackernoon.com/accessing-nested-objects-in-javascript-f02f1bd6387f
        self.findNested = function (path, data) {
            return path.split(".").reduce(function (xs, x) {
                return (xs && xs[x]) ? xs[x] : null
            }, data);
        }

        self.executeRow = function (value) {
            var isNaN = window.isNaN(value);
            var columnInput = apos.schemas.findFieldset(self.$form, "column").find("input");
            if (!isNaN && value !== 0) {
                if (columnInput.attr("disabled") === "disabled") {
                    columnInput.attr("disabled", false);
                }

                if (self.rowData.length > 0) {
                    self.rowData = self.rowData.slice(0, value)
                }

                // Append Rows
                for (var i = 0; i < value; i++) {
                    if (self.rowData[i]) {
                        continue;
                    }
                    self.rowData.push([]);
                }

                // Trigger change to update value based on active row input
                apos.schemas.findFieldset(self.$form, "column").trigger("change");
            }

            if (value === 0) {
                columnInput.attr("disabled", true);
                self.destroyTable();
            }

            return;
        }

        self.executeColumn = function (value) {
            var isNaN = window.isNaN(value);
            var rowInput = apos.schemas.findFieldset(self.$form, "row").find("input");
            var columnInput = apos.schemas.findFieldset(self.$form, "column").find("input");
            if (!isNaN && value !== 0) {

                if (self.columnData.length > 0) {
                    self.columnData = self.columnData.slice(0, value);
                }

                // Loop each row to append new data to it
                for (var a = 0; a < value; a++) {
                    if (self.columnData[a]) {
                        continue;
                    }
                    self.columnData.push({
                        title: "Header " + (a + 1)
                    })
                }

                // Reupload data to column change
                for (var row = 0; row < self.rowData.length; row++) {
                    for (column = 0; column < self.columnData.length; column++) {
                        if (self.rowData[row][column]) {
                            continue;
                        }
                        self.rowData[row].push("untitled");
                    }
                    // Delete unecessary rows data based on columns
                    if (self.rowData[row].length !== self.columnData.length) {
                        self.rowData[row] = self.rowData[row].slice(0, self.columnData.length)
                    }
                }

                // Update to options
                self.EditorDataTableOptions.data = self.rowData;
                self.EditorDataTableOptions.columns = self.columnData;

                if (self.columnData.length > 0) {
                    self.initTable();
                }
            }

            if (value === 0) {
                // Nothing here yet
            }
        }

        self.initTable = function () {
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function (i, val) {
                // When table is visible
                if (val.offsetParent !== null) {
                    if (apos.assets.options.lean) {
                        // Destroy first
                        if (apos.schemas.dt.vanillaJSTable) {
                            if (!self.EditorDataTableOptions.ajax && apos.schemas.dt.vanillaJSTable.options.ajax) {
                                delete apos.schemas.dt.vanillaJSTable.options.ajax;
                                delete apos.schemas.dt.vanillaJSTable.options.load;
                                delete apos.schemas.dt.vanillaJSTable.options.content;
                            }
                            // Always delete data and clear datatables
                            delete apos.schemas.dt.vanillaJSTable.options.data;
                            apos.schemas.dt.vanillaJSTable.clear()
                            try {
                                apos.schemas.dt.vanillaJSTable.destroy()
                            } catch (e) {
                                // Leave the error alone. Nothing to display
                            }
                        }

                        if (self.EditorDataTableOptions.data && self.EditorDataTableOptions.columns) {
                            // Always Convert
                            var data = self.EditorDataTableOptions.data;
                            var columns = self.EditorDataTableOptions.columns;

                            var obj = {
                                headings: [],
                                data: data
                            };

                            obj.headings = columns.reduce(function (init, next, i, arr) {
                                return init.concat(next.title);
                            }, []);
                        }

                        // Empty the table for initialization
                        var $parent = $(val).parent();
                        $parent.empty();
                        // Append the table clone node
                        $parent.append(apos.schemas.dt.getTable.cloneNode());
                        apos.schemas.dt.vanillaJSTable = new simpleDatatables.DataTable($parent.find("#dynamicTable").get(0), self.EditorDataTableOptions.ajax ? self.EditorDataTableOptions : {
                            data: obj
                        })

                    } else {
                        if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
                            try {
                                $(self.$tableHTML[i]).DataTable().clear().destroy();
                            } catch (error) {
                                // Leave the error alone. Nothing to display
                            }
                        }
                        // Delete additional data on options when initialized
                        delete self.EditorDataTableOptions.aaData
                        delete self.EditorDataTableOptions.aoColumns;

                        // Bug : DataTable won't appear after destroy and replace schema in viewport
                        try {
                            // Empty the table for reinitialization
                            $(self.$tableHTML[i]).empty();
                            // Initialize
                            $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions).draw();
                        } catch (e) {
                            // Empty the table for reinitialization
                            var $parent = $(val).parent();
                            $parent.empty()
                            // Append the table clone node
                            $parent.append(apos.schemas.dt.getTable.cloneNode());
                            // Reinitialize & MUST DRAW to start
                            $parent.find("#dynamicTable").DataTable(self.EditorDataTableOptions).draw();
                        }
                        return;
                    }
                }
            });

            // Register any DataTablesJS Event
            self.registerTableEvent(self.$tableHTML);

            // For Schema Auto Insert
            if (self.rowData.length !== 0 && self.columnData.length !== 0) {
                var convertData = apos.schemas.findFieldset(self.$form, "data").find("textarea");
                convertData.val(JSON5.stringify({
                    data: self.rowData,
                    columns: self.columnData
                }, {
                    space: 2
                }));
                self.executeAutoResize(convertData.get(0));
            }
        }

        self.destroyTable = function () {
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function (i, val) {
                // When table is visible
                if (val.offsetParent !== null) {

                    if (apos.assets.options.lean) {
                        // get from schemas extends
                        if (apos.schemas.dt.vanillaJSTable) {
                            // Always delete data and clear datatables
                            delete apos.schemas.dt.vanillaJSTable.options.data;
                            apos.schemas.dt.vanillaJSTable.clear();
                            apos.schemas.dt.vanillaJSTable.destroy();
                            delete apos.schemas.dt.vanillaJSTable;
                        }

                        delete self.EditorDataTableOptions.data
                        delete self.EditorDataTableOptions.columns;

                        $(self.$tableHTML[i]).empty();
                    } else {
                        if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
                            try {
                                $(self.$tableHTML[i]).DataTable().clear().destroy();
                            } catch (e) {
                                // Leave the error alone. Nothing to display
                            }
                            $(self.$tableHTML[i]).empty();

                            delete self.EditorDataTableOptions.aaData
                            delete self.EditorDataTableOptions.aoColumns;
                            delete self.EditorDataTableOptions.data
                            delete self.EditorDataTableOptions.columns;
                            return;
                        }
                    }
                }
            })
        }

        self.getTable = function(){
            return $.get("/modules/dynamic-table/fields", { id : self.$id.find("input").val() } , function(data){
                if(data.status === "success"){
                    self.exists = true;
                    return;
                }else if(data.status === "error"){
                    self.exists = false;
                }
            })
        }

        self.save = function(callback){
            var piece = {
                title: self.$title.find("input").val(),
                id: self.$id.find("input").val(),
                row: self.$row.find("input").val(),
                column: self.$column.find("input").val(),
                data: self.$data.find("textarea").val(),
                url: window.location.pathname
            }
            if(!self.exists){
                return apos.dynamicTable.api("submit", piece, function (data) {
                    if (data.status === "success") {
                        return callback(null);
                    }

                    return callback(data.message);
                }, function (err) {
                    return callback(err);
                })
            }else{
                return apos.dynamicTable.api("update", piece, function (data) {
                    if (data.status === "success") {
                        return callback(null);
                    }

                    return callback(data.message);
                }, function (err) {
                    return callback(err);
                })
            }
        }

        self.registerTableEvent = function ($table) {

        }
    }
})