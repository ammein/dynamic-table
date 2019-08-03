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
            Object.assign(self.EditorDataTableOptions , JSON.parse(options));
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

        self.initTable = function(){
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function (i, val) {
                // When table is visible
                if(val.offsetParent !== null){
                    if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
                        $(self.$tableHTML[i]).DataTable().clear().destroy();
                        // Delete additional data on options when initialized
                        delete self.EditorDataTableOptions.aaData
                        delete self.EditorDataTableOptions.aoColumns;
                        // Empty the table to reinitialization
                        $(self.$tableHTML[i]).empty();
                        $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions);
                        return;
                    }

                    $(self.$tableHTML[i]).DataTable(self.EditorDataTableOptions);
                    return;
                }
            });

            // For Schema Auto Insert
            if(self.rowData.length !== 0 && self.columnData.length !== 0){
                var convertData = self.$data.find("textarea");
                convertData.val(JSON.stringify(JSON.parse("{" + "\"data\" : " + JSON.stringify(self.rowData) + "," + "\"columns\" : " + JSON.stringify(self.columnData) + "}"), undefined, 2));
                self.executeAutoResize(convertData.get(0));
            }
        }

        self.destroyTable = function(){
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function(i , val){
                // When table is visible
                if(val.offsetParent !== null){
                    if ($.fn.DataTable.isDataTable($(self.$tableHTML[i]))) {
                        $(self.$tableHTML[i]).DataTable().clear().destroy();
                        $(self.$tableHTML[i]).empty();

                        delete self.EditorDataTableOptions.aaData
                        delete self.EditorDataTableOptions.aoColumns;
                        delete self.EditorDataTableOptions.data
                        delete self.EditorDataTableOptions.columns;
                        return;
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
                        var options = JSON.parse(JSON.stringify(e.currentTarget.querySelector("textarea").value))
                        self.executeAjax(options);
                    }catch(e){
                        console.warn(e);
                    }
                })

                self.$data.on("change" , function(e){
                    try{
                        var data = JSON.parse(e.currentTarget.querySelector("textarea").value);

                        // Auto Convert Columns Title
                        data.columns = data.columns.map(function(item){
                            if (
                                self.columnData[i] &&
                                self.columnData[i].title && 
                                item.title !== self.columnData[i].title
                                ){
                                // Adjust Title
                                item.sTitle = next.title;

                            } 
                            else if (
                                self.columnData[i] && 
                                self.columnData[i].sTitle && 
                                item.sTitle !== self.columnData[i].sTitle
                                ){
                                // Adjust Title
                                item.title = next.sTitle;

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
                self.executeAutoResize(ajaxOptions.get(0))
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
                        self.$data.find("input").value = JSON.stringify({
                            table: {
                                data: self.rowData,
                                columns: self.columnData
                            }
                        });
                        return callback(null);
                    }

                    return callback(null,"Error : " + data.message);
                }, function(err){
                    return callback(err);
                })
            })
        }

    }
})