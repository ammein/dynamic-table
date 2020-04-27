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
                const { type } = tables;
                return apos.docs.db.remove({ type }, {multi: true}, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    var key = "widgetsArea.items"

                    var query = {
                        [key]: {
                            $elemMatch: {
                                type: "dynamic-table"
                            }
                        }
                    };
                    return apos.docs.db.find(query, {
                                [key] : 1
                            }).toArray(function(err, result) {
                                if (err){
                                    return callback(err);
                                }

                                const dupResult = [...result];
                                dupResult.map(function(val, i, arr) {
                                    return val.type !== "dynamic-table";
                                });

                                return apos.docs.db.update(query, {
                                    $set: {
                                        [key] : dupResult
                                    }
                                }, {
                                    multi: true
                                }, callback)
                            })
                });
            }, callback);
        }
    }
}