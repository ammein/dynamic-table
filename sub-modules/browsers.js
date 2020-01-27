/* eslint-disable no-var */
const _ = require('lodash')
module.exports = function(self, options) {
    self.allBrowserCalls = function () {
        var myOptions = {}
        _.defaults(myOptions, {
            name: 'dynamic-table-utils',
            browser: {}
        })

        _.extend(myOptions.browser, {
            action: '/modules/dynamic-table',
            schemas: self.tableSchemas,
            group: self.tableSchemasGroup
        })

        // To push apos.modules["dynamic-table-utils"] && also other options to pass on
        self.apos.push.browserCall('user', 'apos.createModule(? , ? , ?)', 'dynamic-table-utils', {
            tabulator: self.options.tabulator || {
                layout: 'fitColumns',
                autoColumns: true,
                responsiveLayout: true
            },
            apiModuleName: self.__meta.name,
            callbacks: self.callbacks,
            ...myOptions
        }, 'dynamicTableUtils')
    }
}