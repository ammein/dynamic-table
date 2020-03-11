import cache from './sub-customCodeEditor/cache';
import stringsHelper from './sub-customCodeEditor/strings';
import insertCode from './sub-customCodeEditor/insertCode';
import events from './sub-customCodeEditor/events';
/* global JSONfn, ace */
apos.define('custom-code-editor', {
    construct: function(self, options) {
        // create superPopulate to extend method
        let superPopulate = self.populate;

        let superConvert = self.convert;

        // Get extension self object
        let _this = self;

        // Clean up data and reject if unacceptable
        self.convert = function (data, name, $field, $el, field, callback) {
            return superConvert(data, name, $field, $el, field, function(err) {
                if (err) {
                    return callback(err)
                }

                let returnObj = {}

                if (self.tabulator.originalCache[name]) {
                    let dataObj = JSONfn.parse(self.tabulator.convertJSONFunction(data[name].code))
                    let originalObj = self.tabulator.originalCache[name].reduce((init, next, i) => Object.assign({}, init, next), {});
                    let cacheObj = self.tabulator.cache[name].reduce((init, next, i) => Object.assign({}, init, next), {});

                    for (let key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            let oriKey = Object.getOwnPropertyNames(originalObj).filter((val, i) => val === key)[0]
                            if (key === oriKey) {
                                // Match String function
                                if (cacheObj[key].toString() !== originalObj[key].toString()) {
                                    returnObj[key] = cacheObj[key]
                                }
                            }
                        }
                    }

                    // Set into object serverside
                    if (Object.getOwnPropertyNames(returnObj).length > 0) {
                        data[name].code = JSONfn.stringify(returnObj);
                    } else {
                        delete data[name]
                    }
                }

                if (apos.dynamicTableUtils.$options.data().name === name) {
                    returnObj = JSONfn.parse(self.tabulator.convertJSONFunction(data[name].code))
                    // Set into object serverside
                    if (Object.getOwnPropertyNames(returnObj).length > 0) {
                        data[name].code = JSONfn.stringify(returnObj);
                    } else {
                        delete data[name]
                    }
                }

                return setImmediate(callback);
            });
        }

        self.populate = function (object, name, $field, $el, field, callback) {
            superPopulate(object, name, $field, $el, field, callback)

            // Set tabulator object when only this value is perform
            self.tabulator = {
                callbacks: {},
                cache: {},
                originalCache: {}
            };

            // Locate the element on specific schema
            let $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            let $fieldInput = $fieldSet.find('[data-editor]').get(0);

            // Init Editor
            // eslint-disable-next-line no-undef
            let editor = ace.edit($fieldInput);

            self.tabulator.restartTable = function (callbackObj) {
                // Restart Table
                apos.dynamicTableUtils.hardReloadTable(Object.assign({}, apos.dynamicTableUtils.tabulator.options, callbackObj));
            }

            events(self, options);
            stringsHelper(self, options);
            cache(self, options);
            insertCode(self, options, object);
        }
    }
})