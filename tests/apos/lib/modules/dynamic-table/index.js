module.exports = {
    construct: function(self,options) {
        self.addTask('delete', "Run this command to delete all created table for nightwatch tests", (apos, argv, callback) => {
            var req = self.apos.tasks.getReq();
            self.runMigrations(apos, callback);
        })

        self.runMigrations = function(apos, callback) {
            return apos.migrations.eachDoc({
                type: "dynamic-tables"
            }, (tables, callback)=> {
                console.log("Removing Tables from dynamic-table documents for testing");
                console.log("List of All Tables", JSON.stringify(tables, undefined, 2));
                return apos.docs.db.remove({ type: "dynamic-tables" }, callback);
            }, callback);
        }
    }
}