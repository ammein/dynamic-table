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
                        title: "Header" + (a + 1)
                    })
                }

                // Reupload data to column change
                for (var row = 0; row < self.rowData.length; row++) {
                    // Check Current Row
                    if (self.rowData[row].length > 0) {
                        self.rowData[row] = [];
                    }
                    for (column = 0; column < self.columnData.length; column++) {
                        self.rowData[row].push("data");
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
            if($.fn.DataTable.isDataTable(self.$tableHTML)){
                self.$tableHTML.DataTable().clear().destroy();
                // Delete additional data on options when initialized
                delete self.EditorDataTableOptions.aaData
                delete self.EditorDataTableOptions.aoColumns;
                // Empty the table to reinitialization
                self.$tableHTML.empty();
                self.$tableHTML.DataTable(self.EditorDataTableOptions);
                return;
            }

            self.$tableHTML.DataTable(self.EditorDataTableOptions);
            return;
        }

        self.destroyTable = function(){
            self.$tableHTML.DataTable().clear().destroy();
            self.$tableHTML.empty();

            delete self.EditorDataTableOptions.aaData
            delete self.EditorDataTableOptions.aoColumns;
            delete self.EditorDataTableOptions.data
            delete self.EditorDataTableOptions.columns;
            return;
        }

        self.tableHeader = function(){
            return $(self.$tableHTML.DataTable().table().header());
        }

        self.tableBody = function(){
            return $(self.$tableHTML.DataTable().table().body());
        }

        self.tableFooter = function(){
            return $(self.$tableHTML.DataTable().table().footer());
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

                self.$divTable = self.$form.find(".dynamic-table-area");

                var rowInput = self.$row.find("input");
                var columnInput = self.$column.find("input");

                // Disabled first by default
                if(rowInput.val().length < 1){
                    columnInput.attr("disabled", true);
                }

                if(rowInput.val().length > 0 && columnInput.val().length > 0){
                    // Just trigger row change event
                    self.$row.trigger("change");
                }

                self.$row.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    self.executeRow(num);
                })


                self.$column.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    self.executeColumn(num);
                })

                return callback(null);
            });
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