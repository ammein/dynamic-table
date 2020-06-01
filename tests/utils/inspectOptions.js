const JSONfn = require('jsonfn').JSONfn;
module.exports = function (client, inspectOptions, optionsResult) {
    for (let key in inspectOptions) {
        if (optionsResult.hasOwnProperty(key) && inspectOptions.hasOwnProperty(key)) {
            client.assert.ok((typeof inspectOptions[key] === "function" ? JSONfn.stringify(inspectOptions[key]) : inspectOptions[key]) === (typeof optionsResult[key] === "function" ? JSONfn.stringify(optionsResult[key]) : optionsResult[key]), `Compares two callback value for '${key}':\n\n ${key} : ${inspectOptions[key]} \n-------------------- WITH --------------------\n ${key} : ${optionsResult[key]}\n\n`);
        } else {
            throw new Error(`\nKey for "${key}" is not found on:\n\n${JSONfn.stringify(optionsResult)}\n\n`);
        }
    }
}