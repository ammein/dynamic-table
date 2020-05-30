module.exports = function(client, originalCallback, resultCallback) {
    console.log("Running Inspection on Callback")
    for (let key in resultCallback) {
        if (resultCallback.hasOwnProperty(key) && originalCallback.hasOwnProperty(key)) {
            for (let innerKey in resultCallback) {
                if (resultCallback[key].hasOwnProperty(innerKey) && originalCallback[key].hasOwnProperty(innerKey)) {
                    console.log(`Callback inspect on ${JSONfn.stringify(resultCallback[key][innerKey])} & ${JSONfn.stringify(originalCallback[key][innerKey])}`)
                    client.assert.ok(JSONfn.stringify(resultCallback[key][innerKey]) === JSONfn.stringify(originalCallback[key][innerKey]));
                }
            }
        }
    }
}