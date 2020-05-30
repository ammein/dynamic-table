const JSONfn = require('jsonfn').JSONfn;
module.exports = function(client, originalCallback, resultCallback) {
    console.log("Running Inspection on Callback")
    for (let key in resultCallback) {
        if (resultCallback.hasOwnProperty(key) && originalCallback.hasOwnProperty(key)) {
            for (let innerKey in resultCallback[key]) {
                if (resultCallback[key].hasOwnProperty(innerKey) && originalCallback[key].hasOwnProperty(innerKey)) {
                    console.log(`Callback inspect on ${JSONfn.stringify(resultCallback[key][innerKey])} & ${JSONfn.stringify(originalCallback[key][innerKey])}`)
                    client.assert.ok(JSONfn.stringify(resultCallback[key][innerKey]) === JSONfn.stringify(originalCallback[key][innerKey]));
                } else {
                    var matchInnerKey = Object.getOwnPropertyNames(resultCallback[key]).filter(function(val) {
                        return val === innerKey;
                    })
                    if (matchInnerKey.length === 0) {
                        throw new Error(`\nKey for "${innerKey}" is not found on:\n\n${JSONfn.stringify(originalCallback[key])}`);
                    }
                }
            }
        } else {
            var matchKey = Object.getOwnPropertyNames(resultCallback).filter(function (val) {
                return val === key;
            })
            if (matchKey.length === 0) {
                throw new Error(`\nKey for "${key}" is not found on:\n\n${JSONfn.stringify(originalCallback)}`);
            }
        }
    }
}