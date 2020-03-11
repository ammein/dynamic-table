import beautifyJS, { beautifyOptions } from '../../beautifer';
/* global JSONfn  */
let cache = function (self, options) {
    // To check and compare with cache. If changes detected, replace the value. Also return with new object on changes
    self.tabulator.cacheCheck = function (editorType, valueObj) {
        let returnObj = {}
        // Return Adjusted Changes Only
        self.tabulator.cache[editorType].forEach(function (val, i, arr) {
            for (let key in valueObj) {
                if (valueObj.hasOwnProperty(key)) {
                    if (Object.getOwnPropertyNames(val)[0] === key &&
                        val[key].toString() !== valueObj[key].toString()) {
                        returnObj[key] = valueObj[key];
                    }
                }
            }
        });

        // Adjust Cache
        for (let key in valueObj) {
            if (valueObj.hasOwnProperty(key)) {
                self.tabulator.cache[editorType] = self.tabulator.cache[editorType].map(function (val, i, arr) {
                    if (key === Object.getOwnPropertyNames(val)[0]) {
                        return {
                            [key]: valueObj[key]
                        };
                    } else {
                        return val;
                    }
                })
            }
        }

        return returnObj;
    }

    // Store all editor cache
    self.tabulator.editorCache = function (editorType, string) {
        self.tabulator.cache[editorType] = []
        self.tabulator.originalCache[editorType] = []

        // Beautify it
        string = beautifyJS(string, beautifyOptions);

        let JSONFuncObj = JSONfn.parse(self.tabulator.convertJSONFunction(string));

        for (let key in JSONFuncObj) {
            if (JSONFuncObj.hasOwnProperty(key)) {
                self.tabulator.cache[editorType] = self.tabulator.cache[editorType].concat({
                    [key]: JSONFuncObj[key]
                })
                self.tabulator.originalCache[editorType] = self.tabulator.originalCache[editorType].concat({
                    [key]: JSONFuncObj[key]
                })
            }
        }
    }
}

export default cache;