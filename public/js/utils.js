apos.define("dynamic-table-utils", {
    construct : function(self,options){
        // options.schemas && options.object receives whenever dynamic-table-widgets-editor available

        self.originalEditorDataTableOptions = options.editorDataTableOptions;

        self.exists = false;

        self.updateRowsAndColumns = function(object){
            self.rowData = object.data;
            self.columnData = object.columns;

            // Update to options
            self.EditorDataTableOptions.data = self.rowData;
            self.EditorDataTableOptions.columns = self.columnData;
        }

        self.resetCustomTable = function(){
            var rowInput = apos.schemas.findFieldset(self.$form, "row").find("input");
            var columnInput = apos.schemas.findFieldset(self.$form, "column").find("input");
            var dataInput = apos.schemas.findFieldset(self.$form, "data").find("textarea");
            if (dataInput.length > 0) {
                dataInput.val("");
            }
            if (rowInput.length > 0) {
                rowInput.val("")
            }
            
            if(columnInput.length > 0){
                columnInput.val("");
                columnInput.attr("disabled", true);
            }
        }

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

            // Disabled first by default
            if (rowInput.length > 0 && rowInput.val().length < 1) {
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

                    self.updateRowsAndColumns(data);

                    // Update to inputs
                    if(rowInput.length > 0){
                        rowInput.val(data.data.length);
                    }

                    if(columnInput.length > 0){
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
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            var ajaxOptions = self.$ajaxOptions.find("textarea");
            var dataInput = self.$data.find("textarea");
            var idInput = self.$id.find("input");
            self.$chooser = apos.schemas.findFieldset(self.$form, "_dynamicTable").data("aposChooser");
            // Let change event registered first, then trigger it
            if (
                rowInput.length > 0 &&
                columnInput.length > 0 &&
                ajaxOptions.length > 0 &&
                rowInput.val().length > 0 && 
                columnInput.val().length > 0 && 
                ajaxOptions.val().length === 0) 
            {
                // Just trigger row change event
                self.$row.trigger("change");
            }

            if (ajaxOptions.length > 0 && ajaxOptions.val().length > 0) {
                // To enable textarea auto resize
                self.$ajaxOptions.trigger("change");
            }

            if (idInput.length > 0 && idInput.val().length === 0) {
                idInput.val(data ? data._id : "")
            }
            if(self.$chooser){
                self.getJoin(self.$chooser);
            }

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
            self.resetCustomTable();
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
                if (columnInput.length > 0 && columnInput.attr("disabled") === "disabled") {
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
                if(columnInput.length > 0){
                    columnInput.attr("disabled", true);
                }
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
                self.convertData()
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

        self.convertData = function(){
            var convertData = apos.schemas.findFieldset(self.$form, "data").find("textarea");
            if(convertData.length > 0){
                convertData.val(JSON5.stringify({
                    data: self.rowData,
                    columns: self.columnData
                }, {
                    space: 2
                }));
                self.executeAutoResize(convertData.get(0));
            }
        }

        self.getFields = function(query, callback){
            return $.get("/modules/dynamic-table/fields" , query , function(data){
                if(data.status === "success"){
                    return callback(null , data.message);
                }
                return callback(data.message);
            })
        }

        self.updateFields = function(query,callback){
            return self.api("update", query , function(data){
                if(data.status === "success"){
                    return callback(null , data.message)
                }
                return callback(data.message);
            })
        }

        self.getResultAndInitTable = function(result){
            // Loop result object
            for (let property of Object.keys(result)) {
                if (result.hasOwnProperty(property)) {
                    switch (property) {
                        case "ajaxOptions":
                            try {
                                self.executeAjax(JSON5.parse(result[property]))                            
                            } catch (e) {
                                // Leave the error alone
                            }
                            break;

                        case "data":
                            self.updateRowsAndColumns(JSON5.parse(result[property]));
                            break;

                    }
                }
            }

            // Start the table
            self.initTable();
        }

        self.getJoin = function($chooser){
            var superAfterManagerSave = $chooser.afterManagerSave;
            var superAfterManagerCancel = $chooser.afterManagerCancel;
            var getChoiceId = $chooser.choices[0].value;

            $chooser.afterManagerSave = function(){
                superAfterManagerSave();
                var getNewChoiceId = $chooser.choices[0].value;
                // Get field first
                return self.getFields({ id: getNewChoiceId }, function (err, result) {
                    if (err) {
                        return apos.utils.warn("Dynamic Table Piece not found");
                    }

                    if(getChoiceId !== getNewChoiceId){
                        return self.updateFields({
                            id: getChoiceId,
                            url: undefined
                        }, function (err) {
                            if (err) {
                                return apos.utils.warn("Cannot update url for previous piece");
                            }

                            return self.updateFields({
                                id : getNewChoiceId,
                                url : window.location.pathname
                            },function(err){
                                if(err){
                                    return apos.utils.warn("Unable to update new piece save");
                                }
                                // reset choice value
                                getChoiceId = getNewChoiceId;
                                // Update Table
                                return self.getResultAndInitTable(result);
                            })
                        })
                    }
                })
                
            }

            $chooser.afterManagerCancel = function(){
                superAfterManagerCancel();
                self.destroyTable();

                return self.getFields({ id : getChoiceId }, function(err, result){
                    if(err){
                        return apos.utils.warn("Dynamic Table Piece not found");
                    }

                    return self.getResultAndInitTable(result);
                })
            }
        }

        self.registerTableEvent = function ($table) {

        }
    }
})