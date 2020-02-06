import beautifyJS, { beautifyOptions } from './beautifier';
/* global JSONfn */
let insertCode = function (self, options, object) {
    self.tabulator.optionsValue = function ($form, type, options = {}, reset = false) {

        // Delete if ajaxURL is available
        if (Object.getOwnPropertyNames(options).length > 0) {
            self.originalOptions = Object.assign({}, options);
            if (self.originalOptions.ajaxURL) {
                delete self.originalOptions.ajaxURL;
            }
        }

        // To Store any existsObject available for object[type]
        let existsObject = {}

        // To disable highlight linting
        self[type].editor.session.setUseWorker(false);

        // Check if exists object[type] is available
        if (object[type] && Object.getOwnPropertyNames(JSONfn.parse(object[type].code)).length > 0 && !reset) {
            existsObject = Object.assign({}, existsObject, self.originalOptions, JSONfn.parse(object[type].code))
            let strings = beautifyJS(self.tabulator.convertToString(JSONfn.parse(object[type].code)), beautifyOptions);

            self[type].editor.setValue(strings);
        } else {
            self[type].editor.setValue(beautifyJS(self.tabulator.convertToString(self.originalOptions), beautifyOptions));

            apos.dynamicTableUtils.tabulator.options = Object.assign({}, apos.dynamicTableUtils.tabulator.options, self.originalOptions);
        }

        self.tabulator.events(type, false);

        if (Object.getOwnPropertyNames(existsObject).length > 0) {
            self.tabulator.restartTableCallback(existsObject)
        }
    }

    // This is where it all started
    self.tabulator.setValue = function ($form, types, reset) {
        let existsObject = {}
        types.forEach(function (val, i, arr) {
            let strings = beautifyJS(apos.dynamicTableUtils.tabulator.callbackStrings(val), beautifyOptions);

            // Set Worker to be false to disable error highlighting
            self[val].editor.session.setUseWorker(false);

            // Store to cache for comparison check
            self.tabulator.editorCache(val, strings);

            if (object[val] && Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).length > 0 && !reset) {
                let obj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                // Restart Table
                existsObject = Object.assign({}, existsObject, apos.dynamicTableUtils.tabulator.options, JSONfn.parse(object[val].code))

                // Change on cache if its match
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let objectKey = Object.getOwnPropertyNames(JSONfn.parse(object[val].code)).filter((val, i) => val === key)[0];
                        let objectFunc = JSONfn.parse(object[val].code)[key]
                        if (objectKey === key) {
                            self.tabulator.cache[val] = self.tabulator.cache[val].map(function (cacheObj, i, arr) {
                                if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                                    return {
                                        [key]: objectFunc
                                    }
                                } else {
                                    return cacheObj
                                }
                            })
                            self.tabulator.originalCache[val] = self.tabulator.originalCache[val].map(function (cacheObj, i, arr) {
                                if (Object.getOwnPropertyNames(cacheObj)[0] === key) {
                                    return {
                                        [key]: objectFunc
                                    }
                                } else {
                                    return cacheObj
                                }
                            })

                            // Parse the objects of functions and convert to string
                            let editorStringObj = JSONfn.parse(self.tabulator.convertJSONFunction(strings))
                            for (let editorKey in editorStringObj) {
                                if (editorStringObj.hasOwnProperty(editorKey)) {
                                    if (editorKey === key) {
                                        editorStringObj[editorKey] = objectFunc
                                    }
                                }
                            }

                            // Apply to editor string value
                            self[val].editor.session.setValue(self.tabulator.convertToString(editorStringObj))
                        }
                    }
                }
            } else {
                // Set Value to Editor after checking the exists object
                self[val].editor.session.setValue(strings);
            }

            // Apply on change events (Must trigger last!)
            self.tabulator.events(val);
            // End Set Value
        })
        // End loop
        if (Object.getOwnPropertyNames(existsObject).length > 0) {
            self.tabulator.restartTableCallback(existsObject)
        }
    }
}

export default insertCode;