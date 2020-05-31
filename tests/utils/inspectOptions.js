const JSONfn = require('jsonfn').JSONfn;
module.exports = function (client, inspectOptions, resultOptions) {
    for (let key in inspectOptions) {
        if (resultOptions.hasOwnProperty(key) && inspectOptions.hasOwnProperty(key)) {
            client.assert.ok(JSONfn.stringify(inspectOptions[key]) === JSONfn.stringify(resultOptions[key]), `Compares two callback value for '${key}':\n\n ${innerKey} : ${inspectOptions[key]} \n-------------------- WITH --------------------\n ${innerKey} : ${resultOptions[key]}\n\n`);
        } else {
            throw new Error(`\nKey for "${key}" is not found on:\n\n${JSONfn.stringify(resultOptions)}\n\n`);
        }
    }
}