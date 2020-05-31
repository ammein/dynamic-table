const JSONfn = require('jsonfn').JSONfn;
module.exports = function(client, inspectCallback, resultCallback) {
    for (let key in inspectCallback) {
        if (resultCallback.hasOwnProperty(key) && inspectCallback.hasOwnProperty(key)) {
            for (let innerKey in inspectCallback[key]) {
                if (resultCallback[key].hasOwnProperty(innerKey) && inspectCallback[key].hasOwnProperty(innerKey)) {
                    client.assert.ok(JSONfn.stringify(inspectCallback[key][innerKey]) === JSONfn.stringify(resultCallback[key][innerKey]), `Compares two callback value for '${key}':\n\n ${innerKey} : ${inspectCallback[key][innerKey]} \n-------------------- WITH --------------------\n ${innerKey} : ${resultCallback[key][innerKey]}\n\n`);
                } else {
                    throw new Error(`\nKey for "${innerKey}" is not found on:\n\n${JSONfn.stringify(resultCallback[key])}\n\n`);
                }
            }
        } else {
            throw new Error(`\nKey for "${key}" is not found on:\n\n${JSONfn.stringify(resultCallback)}\n\n`);
        }
    }
}