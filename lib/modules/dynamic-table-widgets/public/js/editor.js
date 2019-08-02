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
            var data = self.$data.find("textarea");
            rowInput.val("")
            columnInput.val("");
            data.val("");
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
                    self.rowData = [];
                }

                // Append Rows
                for (var i = 0; i < value; i++) {
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
                    self.columnData = [];
                }

                // Loop each row to append new data to it
                for (var a = 0; a < value; a++) {
                    self.columnData.push({
                        title: "Header " + (a + 1)
                    })
                }

                // Reupload data to column change
                for (var row = 0; row < self.rowData.length; row++) {
                    // Check Current Row
                    if (self.rowData[row].length > 0) {
                        self.rowData[row] = [];
                    }
                    for (column = 0; column < self.columnData.length; column++) {
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
            var convertData = self.$data.find("textarea");
            convertData.val(JSON.stringify(JSON.parse("{" + "\"data\" : " + JSON.stringify(self.rowData) + "," + "\"columns\" : " + JSON.stringify(self.columnData) + "}") , undefined, 2));
        }

        self.destroyTable = function(){
            // Refresh Existing Table
            self.$tableHTML = self.$form.find("table#dynamicTable");

            // Safe method. Table may display many
            self.$tableHTML.each(function(i , val){
                // When table is visible
                if(val.offsetParent !== null){
                    $(self.$tableHTML[i]).DataTable().clear().destroy();
                    $(self.$tableHTML[i]).empty();

                    delete self.EditorDataTableOptions.aaData
                    delete self.EditorDataTableOptions.aoColumns;
                    delete self.EditorDataTableOptions.data
                    delete self.EditorDataTableOptions.columns;
                    return;
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

                // Disabled first by default
                if(rowInput.val().length < 1){
                    columnInput.attr("disabled", true);
                }

                self.$row.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    self.executeRow(num);
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
                        console.log(e);
                    }
                })

                self.$data.on("change" , function(e){
                    try{
                        var data = JSON.parse(e.currentTarget.querySelector("textarea").value);

                        self.rowData = data.data;
                        self.columnData = data.columns;

                        // Update to options
                        self.EditorDataTableOptions.data = self.rowData;
                        self.EditorDataTableOptions.columns = self.columnData;

                        self.initTable();

                        rowInput.val(data.data.length);
                        columnInput.val(data.columns.length)
                    }catch (e){
                        console.log(e);
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
            // Let change event registered first, then trigger it
            if (rowInput.val().length > 0 && columnInput.val().length > 0 && ajaxOptions.val().length === 0) {
                // Just trigger row change event
                self.$row.trigger("change");
            }

            if(ajaxOptions.val().length > 0){
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