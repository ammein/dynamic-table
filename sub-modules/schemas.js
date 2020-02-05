module.exports = function(self, options) {
    self.dynamicTableSchemas = function () {
        self.tableSchemas = self.apos.schemas.subset(self.schema,
            ['title', 'row', 'column', 'data', 'ajaxURL', 'id', 'url', 'adjustRow', 'adjustColumn', 'tabulatorOptions', 'callbacks', 'tableCallback', 'columnCallback', 'ajaxCallback', 'rowCallback', 'cellCallback', 'dataCallback', 'filterCallback', 'sortingCallback', 'layoutCallback', 'paginationCallback', 'selectionCallback', 'rowMovementCallback', 'validationCallback', 'historyCallback', 'clipboardCallback', 'downloadCallback', 'dataTreeCallback', 'scrollingCallback'])
        self.tableSchemasGroup = self.apos.schemas.toGroups(self.schema);
    };
}