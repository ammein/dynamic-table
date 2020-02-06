module.exports = function(self, options) {
    self.dynamicTableSchemas = function () {
        let subsetSchemaLists = self.schema.filter(val => val.browserSchema).map(val => val.name);
        self.tableSchemas = self.apos.schemas.subset(self.schema, subsetSchemaLists)
        self.tableSchemasGroup = self.apos.schemas.toGroups(self.schema);
    };
}