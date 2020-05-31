const JSONfn = require("jsonfn").JSONfn;
exports.command = function tabulatorOptions(value, key, callback){
    var resultOptions = {};
    var self = this;
    return self
        .clickTabInModal("dynamic-table-editor-modal", "Tabulator Options")
        .execute(function(options, keyOptions){
            var tabulatorOptions = JSONfn.parse(apos.customCodeEditor.tabulator.convertJSONFunction(apos.customCodeEditor["tabulatorOptions"].editor.session.getValue()));

            var previousTabulatorOptions = Object.assign({}, tabulatorOptions);

            tabulatorOptions = Object.assign({}, tabulatorOptions, { [keyOptions]: options });

            apos.customCodeEditor["tabulatorOptions"].editor.session.setValue(apos.customCodeEditor.tabulator.convertToString(tabulatorOptions));

            return {
                success: JSONfn.stringify(tabulatorOptions) !== JSONfn.stringify(previousTabulatorOptions),
                tabulatorOptions: JSONfn.stringify(tabulatorOptions)
            }

        }, [value, key], function(result){
            self.assert.ok(result.value.success, "Tabulator Options test");
            resultOptions = Object.assign({}, JSONfn.parse(result.value.tabulatorOptions))
        })
        .perform(function(done){
            callback(resultOptions,done);
        })
}