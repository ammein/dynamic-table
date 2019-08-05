apos.define('dynamic-table-widgets-editor', {
    extend: "apostrophe-widgets-editor",
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superBeforeSave = self.beforeSave;
        var superAfterShow = self.afterShow;

        self.EditorDataTableOptions = options.EditorDataTableOptions || {
            "scrollY": 200,
            "scrollX": true,
            "retrieve" : true
        };

        self.rowData = [];
        self.columnData = [];

        self.executeAjax = function(options){
            self.destroyTable();
            delete self.EditorDataTableOptions.data;
            delete self.EditorDataTableOptions.columns;
            if (apos.assets.options.lean){
                // Pass to load
                options.load = options.load || function(xhr){
                    var data = JSON.parse(xhr.responseText);
                    var convertData = [];

                    // Loop over the data and style any columns with numbers
                    for (let i = 0; i < data.length; i++) {
                        for (let property in data[i]) {
                            if(options.columns){
                                for (var col = 0; col < options.columns.length; col++) {
                                    var getDataPos = options.columns[col].data;
                                    var getTitle = options.columns[col].title
                                    if (getDataPos.split(".").length > 1 && getDataPos.split(".")[getDataPos.split(".").length - getDataPos.split(".").length] === property) {
                                        convertData[i][getTitle] = self.findNested(getDataPos, data[i][property]);
                                    } else {
                                        convertData[i][getTitle] = data[i][property];
                                    }
                                }
                            }else{
                                convertData[i][property] = data[i][property];
                            }
                        }
                    }

                    console.log(convertData)

                    // Data must return array of objects
                    return JSON.stringify(convertData);
                }
            }else{
                // If switch to DataTablesJquery, delete this unnecessary options
                delete options.load;
                delete options.content;
            }
            // Merge Options
            Object.assign(self.EditorDataTableOptions, options);
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            var dataInput = self.$data.find("textarea");
            rowInput.val("")
            columnInput.val("");
            columnInput.attr("disabled" , true);
            dataInput.val("");
            self.initTable();
            return;
        }

        // [
        //     {
        //         "name": "Tiger Nixon",
        //         "hr": {
        //             "position": "System Architect",
        //             "salary": "$320,800",
        //             "start_date": "2011/04/25"
        //         },
        //         "contact": [
        //             "Edinburgh",
        //             "5421"
        //         ]
        //     }
        // ]

        self.findNested = function(path,data){
            var getData;
            try {
                // Make sure its an array
                JSON.parse(Object.keys(data));
                getData = data.filter(function(val , i , arr){
                    return data[path.split(".")[path.split(".").length - path.split(".").length]][JSON.parse(path.split(".")[path.split(".").length - 1])]
                })
            } catch (e) {
                // Always be Nested Object here
                getData = path.split(".").reduce(function(xs, x) {
                    return (xs && xs[x]) ? xs[x] : null
                }, data)
            }
            return getData;
        }

        self.executeRow = function(value){
            var isNaN = window.isNaN(value);
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            if (!isNaN && value !== 0) {
                if (columnInput.attr("disabled") === "disabled") {
                    columnInput.attr("disabled", false);
                }

                if (self.rowData.length > 0) {
                    self.rowData = self.rowData.slice(0,value)
                }

                // Append Rows
                for (var i = 0; i < value; i++) {
                    if(self.rowData[i]){
                        continue;
                    }
                    self.rowData.push([]);
                }

                // Trigger change to update value based on active row input
                self.$column.trigger("change");
            }

            if (value === 0) {
                columnInput.attr("disabled", true);
                self.destroyTable();
            }

            return;
        }

        self.executeColumn = function(value){
            var isNaN = window.isNaN(value);
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            if (!isNaN && value !== 0) {

                if (self.columnData.length > 0) {
                    self.columnData = self.columnData.slice(0,value);
                }

                // Loop each row to append new data to it
                for (var a = 0; a < value; a++) {
                    if(self.columnData[a]){
                        continue;
                    }
                    self.columnData.push({
                        title: "Header " + (a + 1)
                    })
                }

                // Reupload data to column change
                for (var row = 0; row < self.rowData.length; row++) {
                    for (column = 0; column < self.columnData.length; column++) {
                        if(self.rowData[row][column]){
                            continue;
                        }
                        self.rowData[row].push("untitled");
                    }
                    // Delete unecessary rows data based on columns
                    if(self.rowData[row].length !== self.columnData.length){
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

        self.registerTableEvent = function($table){

        }

        self.initTable = function () {
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function (i, val) {
                // When table is visible
                if (val.offsetParent !== null) {

                    if (apos.assets.options.lean){
                        if(self.EditorDataTableOptions.data && self.EditorDataTableOptions.columns){
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

                        try {
                            // Clear Everything
                            apos.schemas.dt.vanillaJSTable.clear();
                            apos.schemas.dt.vanillaJSTable.destroy();
                            if(self.EditorDataTableOptions.ajax){
                                // For Ajax
                                apos.schemas.dt.vanillaJSTable = new simpleDatatables.DataTable(val, self.EditorDataTableOptions);
                            }else{
                                // Normal
                                apos.schemas.dt.vanillaJSTable = new simpleDatatables.DataTable(val, {
                                    data: obj
                                })
                            }
                        } catch (e) {
                            // Empty the table for initialization
                            var $parent = $(val).parent();
                            $parent.empty();
                            // Append the table clone node
                            $parent.append(apos.schemas.dt.getTable.cloneNode());
                            apos.schemas.dt.vanillaJSTable = new simpleDatatables.DataTable($parent.find("#dynamicTable").get(0), {
                                data : obj
                            })
                        }

                    }else{
                        if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
                            try {
                                $(self.$tableHTML[i]).DataTable().clear().destroy();
                            } catch (error) {
                                // Leave the error alone. Nothing to display
                            }
                            // Delete additional data on options when initialized
                            delete self.EditorDataTableOptions.aaData
                            delete self.EditorDataTableOptions.aoColumns;

                            // Bug : DataTable won't appear after destroy and replace schema in viewport
                            try {
                                // Empty the table to reinitialization
                                $(self.$tableHTML[i]).empty();
                                // Initialize
                                $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions).draw();
                            } catch (e) {
                                // Empty the table to reinitialization
                                var $parent = $(val).parent();
                                $parent.empty()
                                // Append the table clone node
                                $parent.append(apos.schemas.dt.getTable.cloneNode());
                                // Reinitialize & MUST DRAW to start
                                $parent.find("#dynamicTable").DataTable(self.EditorDataTableOptions).draw();
                            }
                            return;
                        }

                        $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions);
                        return;
                    }
                }
            });

            // Register any DataTablesJS Event
            self.registerTableEvent(self.$tableHTML);

            // For Schema Auto Insert
            if (self.rowData.length !== 0 && self.columnData.length !== 0) {
                var convertData = self.$data.find("textarea");
                convertData.val(JSON5.stringify({ data : self.rowData , columns : self.columnData }, { space : 2 }));
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

                    if (apos.assets.options.lean){
                        // get from schemas extends
                        if (apos.schemas.dt.vanillaJSTable) {
                            apos.schemas.dt.vanillaJSTable.clear();
                            apos.schemas.dt.vanillaJSTable.destroy();
                            delete apos.schemas.dt.vanillaJSTable;
                        }

                        delete self.EditorDataTableOptions.data
                        delete self.EditorDataTableOptions.columns;

                        $(self.$tableHTML[i]).empty();
                    }else{
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

        self.tableHeader = function(){
            // Safe method
            return self.$tableHTML.each(function(i , val){
                // If table is visible
                if(val.offsetParent !== null){
                    return $($(self.$tableHTML[i]).DataTable().table().header());
                }
            })
        }

        self.tableBody = function(){
            // Safe method
            return self.$tableHTML.each(function (i, val) {
                // If table is visible
                if (val.offsetParent !== null) {
                    return $($(self.$tableHTML[i]).DataTable().table().body());
                }
            })
        }

        self.tableFooter = function(){
            // Safe method
            return self.$tableHTML.each(function (i, val) {
                // If table is visible
                if (val.offsetParent !== null) {
                    return $($(self.$tableHTML[i]).DataTable().table().footer());
                }
            })
        }

        // Thanks to Stephen Wagner (https://stephanwagner.me/auto-resizing-textarea-with-vanilla-javascript)
        self.textareaAutoResize = function(element){
            element.style.boxSizing = 'border-box';
            var offset = element.offsetHeight - element.clientHeight;
            element.addEventListener('input', function (event) {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + offset + 'px';
            });
        }

        self.executeAutoResize = function(element){
            var offset = element.offsetHeight - element.clientHeight;
            element.style.height = 'auto';
            element.style.height = element.scrollHeight + offset + 'px';
        }

        self.beforeShow = function(callback){
            return superBeforeShow(function(err){
                if(err){
                    return callback(err);
                }

                // Can access self.$el & self.$form in here
                self.$row = apos.schemas.findFieldset(self.$form, "row");
                self.$column = apos.schemas.findFieldset(self.$form, "column");
                self.$data = apos.schemas.findFieldset(self.$form, "data");
                self.$tableHTML = self.$form.find("#dynamicTable");
                self.$ajaxOptions = apos.schemas.findFieldset(self.$form, "ajaxOptions");
                self.$divTable = self.$form.find(".dynamic-table-area");

                var rowInput = self.$row.find("input");
                var columnInput = self.$column.find("input");
                var dataInput = self.$data.find("textarea");
                var ajaxOptions = self.$ajaxOptions.find("textarea");

                // Register Textarea auto resize
                self.textareaAutoResize(dataInput.get(0));
                self.textareaAutoResize(ajaxOptions.get(0));

                // Disabled first by default
                if(rowInput.val().length < 1){
                    columnInput.attr("disabled", true);
                }

                self.$row.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    if(ajaxOptions.val().length > 0){
                        var confirm = window.confirm("You are about to remove your Ajax Input from being used. Are you sure you want to continue ?");
                        if(confirm){
                            // Remove ajax options
                            delete self.EditorDataTableOptions.ajax;
                            delete self.EditorDataTableOptions.columns;
                            delete self.EditorDataTableOptions.processed;
                            ajaxOptions.val("")
                            self.executeRow(num);
                        }else{
                            return;
                        }
                    }else{
                        self.executeRow(num);
                    }
                })


                self.$column.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    self.executeColumn(num);
                })

                self.$ajaxOptions.on("change" , function(e){
                    try{
                        // Use custom JSON5 to beautifully parse the value without double quotes JSON
                        var options = JSON5.parse(e.currentTarget.querySelector("textarea").value);
                        self.executeAjax(options);
                    }catch(e){
                        console.warn(e);
                    }
                })

                self.$data.on("change" , function(e){
                    try{
                        var data = JSON5.parse(e.currentTarget.querySelector("textarea").value);

                        // Auto Convert Columns Title
                        data.columns = data.columns.map(function(item , i){
                            if (
                                self.columnData[i] &&
                                self.columnData[i].title && 
                                item.title !== self.columnData[i].title &&
                                item.title
                                ){
                                // Adjust Title
                                item.sTitle = item.title;

                            } 
                            else if (
                                self.columnData[i] && 
                                self.columnData[i].sTitle && 
                                item.sTitle !== self.columnData[i].sTitle &&
                                item.sTitle
                                ){
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

                        self.initTable();

                        rowInput.val(data.data.length);
                        columnInput.val(data.columns.length)
                    }catch (e){
                        console.warn(e);
                    }
                })

                return callback(null);
            });
        }

        self.afterShow = function(){
            superAfterShow();

            // Let everything running on `beforeShow` above and other functions that might needed to run
            // Then call this function to run when everything is populated
            var rowInput = self.$row.find("input");
            var columnInput = self.$column.find("input");
            var ajaxOptions = self.$ajaxOptions.find("textarea");
            var dataInput = self.$data.find("textarea");
            // Let change event registered first, then trigger it
            if (rowInput.val().length > 0 && columnInput.val().length > 0 && ajaxOptions.val().length === 0) {
                // Just trigger row change event
                self.$row.trigger("change");
            }

            if(ajaxOptions.val().length > 0){
                // To enable textarea auto resize
                self.$ajaxOptions.trigger("change");
            }
        }

        self.beforeSave = function(callback){
            return superBeforeSave(function(err){
                if(err){
                    return callback(err);
                }

                // TODO : Do HTML TABLE to be send to server
                return self.api("submit" , { table : { data : self.rowData, columns : self.columnData }} , function(data){
                    if(data.status === "success"){
                        return callback(null);
                    }

                    return callback(null,"Error : " + data.message);
                }, function(err){
                    return callback(err);
                })
            })
        }

        apos[apos.utils.camelName(self.__meta.name)] = self;

    }
})