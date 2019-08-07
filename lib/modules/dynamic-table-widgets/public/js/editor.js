apos.define('dynamic-table-widgets-editor', {
    extend: "apostrophe-widgets-editor",
    construct : function(self,options){
        var superBeforeShow = self.beforeShow;
        var superBeforeSave = self.beforeSave;
        var superAfterShow = self.afterShow;
        self.dynamicTablePieces = apos.dynamicTable;

        self.EditorDataTableOptions = apos.dynamicTableUtils.EditorDataTableOptions;

        self.beforeShow = function(callback){
            return superBeforeShow(function(err){
                if(err){
                    return callback(err);
                }

                // Pass to Utils
                apos.dynamicTableUtils.$form = self.$form;
                
                // Must always reset rowData & columnData
                apos.dynamicTableUtils.rowData = [];
                apos.dynamicTableUtils.columnData = [];

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
                apos.dynamicTableUtils.textareaAutoResize(dataInput.get(0));
                apos.dynamicTableUtils.textareaAutoResize(ajaxOptions.get(0));

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
                            delete apos.dynamicTableUtils.EditorDataTableOptions.ajax;
                            delete apos.dynamicTableUtils.EditorDataTableOptions.columns;
                            delete apos.dynamicTableUtils.EditorDataTableOptions.processed;
                            ajaxOptions.val("")
                            apos.dynamicTableUtils.executeRow(num);
                        }else{
                            return;
                        }
                    }else{
                        apos.dynamicTableUtils.executeRow(num);
                    }
                })


                self.$column.on("change", function (e) {
                    var num = parseInt(e.currentTarget.querySelector("input").value);
                    apos.dynamicTableUtils.executeColumn(num);
                })

                self.$ajaxOptions.on("change" , function(e){
                    try{
                        // Use custom JSON5 to beautifully parse the value without double quotes JSON
                        var options = JSON5.parse(e.currentTarget.querySelector("textarea").value);
                        apos.dynamicTableUtils.executeAjax(options);
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
                                item.title && item.sTitle
                                ){
                                // Adjust Title
                                item.sTitle = item.title;

                            } 
                            else if (
                                self.columnData[i] && 
                                self.columnData[i].sTitle && 
                                item.sTitle !== self.columnData[i].sTitle &&
                                item.sTitle && item.title
                                ){
                                // Adjust Title
                                item.title = item.sTitle;

                            }
                            return item;
                        });

                        apos.dynamicTableUtils.rowData = data.data;
                        apos.dynamicTableUtils.columnData = data.columns;

                        // Update to options
                        self.EditorDataTableOptions.data = apos.dynamicTableUtils.rowData;
                        self.EditorDataTableOptions.columns = apos.dynamicTableUtils.columnData;

                        // Update to inputs
                        rowInput.val(data.data.length);
                        columnInput.val(data.columns.length);
                        apos.dynamicTableUtils(data.data.length);
                        apos.dynamicTableUtils(data.columns.length);

                        apos.dynamicTableUtils.initTable();
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
                return self.api("submit", {
                            table: {
                                data: apos.dynamicTableUtils.rowData,
                                columns: apos.dynamicTableUtils.columnData
                            }
                        }, function (data) {
                    if(data.status === "success"){
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