apos.define("dynamic-table-utils", {
    afterConstruct : function(self){
        // To let others extend it
        self.allListener();
    },
    construct : function(self,options){
        // options.schemas && options.object receives whenever dynamic-table-widgets-editor available

        self.tableDelimiter = options.tableDelimiter ? options.tableDelimiter : ",";
        self.tableEscapeChar = options.tableEscapeChar;

        // This only allow editorDataTableOptions from server options to be passed on
        if(options.editorDataTableOptions){
            self.keyOptions = Object.keys(options.editorDataTableOptions).map(function (key) {
                return [key, options.editorDataTableOptions[key]];
            });
            self.originalEditorDataTableOptions = _.cloneDeep(options.editorDataTableOptions);
        }

        self.exists = false;

        self.updateRowsAndColumns = function(object){
            if(object){
                self.rowData = object.data;
                self.columnData = object.columns;
            }

            // Update to options
            self.EditorDataTableOptions.data = self.rowData;
            self.EditorDataTableOptions.columns = self.columnData;

            self.executeRow(self.rowData.length);
            self.executeColumn(self.columnData.length);
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

        self.resetDataOptions = function(){
            self.rowData = [];
            self.columnData = [];
            if (apos.schemas.dt.vanillaJSTable && apos.schemas.dt.vanillaJSTable.options){
                delete apos.schemas.dt.vanillaJSTable.options.ajax;
                delete apos.schemas.dt.vanillaJSTable.options.load;
                delete apos.schemas.dt.vanillaJSTable.options.content;
                delete apos.schemas.dt.vanillaJSTable.options.data;
            }

            if(self.EditorDataTableOptions){
                delete self.EditorDataTableOptions;
                delete self.originalEditorDataTableOptions;
                self.originalEditorDataTableOptions = {}
                self.keyOptions.forEach(function(value , i ,arr){
                    self.originalEditorDataTableOptions[value[0]] = value[1];
                })
            }
        }

        self.beforeShowDynamicTable = function($form , data){
            // Reset rows & columns
            self.resetDataOptions();
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

            // Destroy table if exists
            self.destroyTable();

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

                    // Stringify for better user reading
                    ajaxOptions.val(JSON5.parse(JSON.stringify(e.currentTarget.querySelector("textarea").value, undefined , 2)));
                } catch (error) {
                    // Stringify for better user reading
                    ajaxOptions.val(JSON5.parse(JSON.stringify(e.currentTarget.querySelector("textarea").value, undefined, 2)));
                    console.warn(error);
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
                self.updateRowsAndColumns(JSON5.parse(dataInput.val()));
                self.initTable();
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
            var constructorDatatable = this;
            if (
                constructorDatatable.options.ajax.dataSrc &&
                constructorDatatable.options.ajax.dataSrc.length > 0 &&
                constructorDatatable.options.ajax.dataSrc !== ""
            ) {
                var data = JSON.findNested(constructorDatatable.options.ajax.dataSrc, JSON.parse(xhr.responseText));
            } else {
                var data = JSON.parse(xhr.responseText);
            }
            var convertData = [];

            // Loop over the data and style any columns with numbers
            for (let i = 0; i < data.length; i++) {
                for (let property in data[i]) {
                    // If options.columns
                    if (constructorDatatable.options.columns) {
                        var filter = constructorDatatable.options.columns.filter((val, i) => val.data === property);
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
                        apos.notify(`Error : Number of rows isn't based on number of columns. Row ${row} affected` , {
                            type : "error",
                            dismiss : true
                        })
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
                }else{
                    // ALways delete the table and append new to it
                    var $parent = $(val).parent();
                    $parent.empty()
                    $parent.append(apos.schemas.dt.getTable.cloneNode());
                    return;
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

            // Reset options
            self.resetDataOptions();
            self.mergeOptions();

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

                        delete self.EditorDataTableOptions.ajax;
                        delete self.EditorDataTableOptions.data;
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
                        }

                        // Reset Options
                        delete self.EditorDataTableOptions.ajax;
                        delete self.EditorDataTableOptions.data;
                        delete self.EditorDataTableOptions.aaData;
                        delete self.EditorDataTableOptions.columns;
                        delete self.EditorDataTableOptions.aoColumns;
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
            return $.get("/modules/dynamic-table/get-fields" , query , function(data){
                if(data.status === "success"){
                    return callback(null , data.message);
                }
                return callback(data.message);
            })
        }

        self.updateFields = function(query,callback){
            return apos.modules["dynamic-table"].api("update-fields", query, function (data) {
                if(data.status === "success"){
                    return callback(null , data.message)
                }
                return callback(data.message);
            })
        }

        self.removeUrls = function(query, callback){
            return apos.modules["dynamic-table"].api("remove-urls" , query, function(data){
                if(data.status === "success"){
                    return callback(null, data.message);
                }

                return callback(data.message);
            })
        }

        self.getResultAndInitTable = function(ajaxResult){
            // Loop ajaxResult object
            for (let property of Object.keys(ajaxResult)) {
                if (ajaxResult.hasOwnProperty(property)) {
                    switch (property) {
                        case "ajaxOptions":
                            try {
                                self.executeAjax(JSON5.parse(ajaxResult[property]))
                            } catch (e) {
                                // Leave the error alone
                            }
                            break;

                        case "data":
                            try {
                                self.updateRowsAndColumns(JSON5.parse(ajaxResult[property]));
                            } catch (e) {
                                // Leave the error alone
                            }
                            break;

                    }
                }
            }

            // Start the table
            self.initTable();
        }

        self.beforeSave = function(callback){
            if (self.getChoiceId !== self.getNewChoiceId && self.getChoiceId) {
                // Update previous piece
                return self.removeUrls({
                    id: self.getChoiceId,
                    url: window.location.pathname
                }, function (err) {
                    if (err) {
                        apos.utils.warn("Cannot remove url on previous piece");
                    }
                    // Update latest piece
                    return self.updateFields({
                        id: self.getNewChoiceId,
                        url: window.location.pathname
                    }, function (err) {
                        if (err) {
                            apos.utils.warn("Unable to update new piece save");
                            return callback(err)
                        }
                        // reset choice value
                        self.getChoiceId = self.getNewChoiceId;

                        return callback(null);
                    })
                })
            }else if(self.getNewChoiceId && !self.getChoiceId){
                 // Update latest piece
                 return self.updateFields({
                     id: self.getNewChoiceId,
                     url: window.location.pathname
                 }, function (err) {
                     if (err) {
                         apos.utils.warn("Unable to update new piece save");
                         return callback(err)
                     }
                     // reset choice value
                     self.getChoiceId = self.getNewChoiceId;

                     return callback(null);
                 })
            }

            return callback(null);
        }

        self.allListener = function(){
            apos.on("widgetTrashed" , function($widget){
                if ($widget.data() && $widget.data().aposWidget === "dynamic-table"){
                    var pieceId = apos.modules["dynamic-table-widgets"].getData($widget).dynamicTableId;
                    self.removeUrls({ id : pieceId, url : window.location.pathname } , function(err){
                        if(err){
                            return apos.utils.warn("Unable to remove widget location.");
                        }
                        return apos.utils.log("Successful remove widget location.");
                    })
                }
            })
        }

        self.getJoin = function($chooser){
            var superAfterManagerSave = $chooser.afterManagerSave;
            var superAfterManagerCancel = $chooser.afterManagerCancel;
            self.getChoiceId = undefined;
            self.getNewChoiceId = undefined;

            // Destroy table and its options first to avoid DataTablesJQuery Problem
            self.destroyTable()

            if($chooser.choices.length > 0){
                self.getChoiceId = $chooser.choices[0].value;
            }

            if(self.getChoiceId){
                // Get fields first and start
                self.getFields({
                    id: self.getChoiceId
                }, function (err, result) {
                    if (err) {
                        // Reset self.getChoiceId
                        self.getChoiceId = undefined;
                        return apos.utils.warn("Unable to get the table piece. Are you sure it saves correctly ?")
                    }
                    return self.getResultAndInitTable(result);
                })
            }

            $chooser.afterManagerSave = function(){
                superAfterManagerSave();
                // Refresh Form
                self.$form = $chooser.$choices.parent().parent().parent();
                self.getNewChoiceId = $chooser.choices[0].value;
                // Destroy table before reinitialization
                self.destroyTable();

                // Get field first
                return self.getFields({ id: self.getNewChoiceId }, function (err, result) {
                    if (err) {
                        return apos.utils.warn("Dynamic Table Piece not found");
                    }

                    return self.getResultAndInitTable(result);
                })
                
            }

            $chooser.afterManagerCancel = function(){
                superAfterManagerCancel();
                self.destroyTable();

                if ($chooser.choices.length > 0) {
                    self.getChoiceId = $chooser.choices[0].value;
                    return self.getFields({
                        id: self.getChoiceId
                    }, function (err, result) {
                        if (err) {
                            return apos.utils.warn("Dynamic Table Piece not found");
                        }

                        return self.getResultAndInitTable(result);
                    })
                }
            }
        }

        // Any table event is allowed
        self.registerTableEvent = function ($table) {

        }

        self.changeTabRebuildTable = function(element){

            if (apos.assets.options.lean) {
                // Destroy first
                if (apos.schemas.dt.vanillaJSTable) {
                    if (!apos.schemas.dt.settings.ajax && apos.schemas.dt.vanillaJSTable.options.ajax) {
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
                    delete apos.schemas.dt.vanillaJSTable;
                }

                // Always convert
                if (apos.schemas.dt.settings.data && apos.schemas.dt.settings.columns) {
                    var data = apos.schemas.dt.settings.data;
                    var columns = apos.schemas.dt.settings.columns;

                    var obj = {
                        headings: [],
                        data: data
                    };

                    obj.headings = columns.reduce(function (init, next, i, arr) {
                        return init.concat(next.title);
                    }, []);
                }

                // Empty the table to reinitialization
                $(element).empty()

                // Append the table clone node
                $(element).append(apos.schemas.dt.getTable.cloneNode());

                apos.schemas.dt.vanillaJSTable = new simpleDatatables.DataTable(element.querySelector("#dynamicTable"), apos.schemas.dt.settings.ajax ? apos.schemas.dt.settings : {
                    data: obj
                });

                // Apply Event
                self.registerTableEvent(apos.schemas.dt.vanillaJSTable);
            } else {
                // If the table use DataTablesJS, destroy it first
                if ($.fn.DataTable.isDataTable($(element).find("#dynamicTable"))) {
                    try {
                        $(element).find("#dynamicTable").DataTable().clear().destroy();
                    } catch (error) {
                        // Leave the error alone. Nothing to display
                    }
                }

                // Delete additional data on options when initialized
                delete apos.schemas.dt.settings.aaData
                delete apos.schemas.dt.settings.aoColumns;

                // Empty the table to reinitialization
                $(element).empty()

                // Append the table clone node
                $(element).append(apos.schemas.dt.getTable.cloneNode());
                try {
                    // Try if success
                    $(element).find("#dynamicTable").DataTable(apos.schemas.dt.settings);

                    // Apply Event
                    self.registerTableEvent($(element).find("#dynamicTable"));
                } catch (e) {
                    // If not, destroy it ! It will output a console error and the table won't even respond
                    // on change input for row & column
                    $(element).find("#dynamicTable").DataTable().clear();
                    // Just remove dataTable class
                    $(element).find("#dynamicTable").removeClass("dataTable");
                }
            }
        }


        // To always send the data that has schema type of array
        self.arrayFieldsArrange = function(arrayItems , fieldName){
            // Just pass the array items from rowData & columnData
            switch (fieldName) {
                case "adjustRow":
                    for(var row = 0; row < self.rowData.length; row++){
                        // Always replace value and re-edit id
                        arrayItems[row] = {
                            id : apos.utils.generateId(),
                            rowContent: self.rowData[row].map(function(val, i ,arr){
                                return val.replace(new RegExp(`${self.tableDelimiter}`,"g"), `${self.tableEscapeChar || "\""}${self.tableDelimiter}${self.tableEscapeChar || "\""}`)
                            }).join(self.tableDelimiter)
                        }
                    }
                    break;

                case "adjustColumn":
                    for(var column = 0; column < self.columnData.length; column++){
                        arrayItems[column] = {
                            id : apos.utils.generateId(),
                            columnContent: self.columnData[column].title
                        }
                    }
                    break;
            
                default:
                    arrayItems = arrayItems;
                    break;
            }

            return arrayItems;
        }

        self.updateFromArrayFields = function(arrayItems, fieldName){
            // Just pass the array items from rowData & columnData
            var config = {
                delimiter : self.tableDelimiter
            }
            if(self.tableEscapeChar){
                config.escapeChar = self.tableEscapeChar;
            }
            switch (fieldName) {
                case "adjustRow":
                    for (var row = 0; row < arrayItems.length; row++) {
                        self.rowData[row] = Papa.parse(arrayItems[row].rowContent.replace(new RegExp(`\(?:\)`, "g"), ""), config).data[0].map((val) => val.replace(new RegExp(`${self.tableEscapeChar || "\""},${self.tableEscapeChar || "\""}`, "g"), `${self.tableDelimiter}`))
                    }
                    break;

                case "adjustColumn":
                    for (var column = 0; column < arrayItems.length; column++) {
                        self.columnData.map(function(value , i , arr){
                            // In Column, there will be an object, so loop it !
                            for(let property of Object.keys(value)){
                                if(value.hasOwnProperty(property)){
                                    // Make sure its on same array
                                    if(i === column){
                                        value[property] = arrayItems[column].columnContent;
                                    }
                                }
                            }
                            return value;
                        })
                    }
                    break;
            }

            // Update to make convert enabled
            self.updateRowsAndColumns();
        }

        // End of Utils
    }
})