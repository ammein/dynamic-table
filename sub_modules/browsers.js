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
            group: self.tableSchemasGroup,
            callbacks: self.callbacks
        })

        // To push apos.modules["dynamic-table-utils"] && also other options to pass on
        self.apos.push.browserCall('user', 'apos.createModule(? , ? , ?)', 'dynamic-table-utils', {
            jQuery: self.options.jQuery || false,
            tabulator: self.options.tabulator || {
                layout: 'fitColumns',
                autoColumns: true,
                responsiveLayout: true
            },
            callbacks: self.callbacks
        }, 'dynamicTableUtils')

        // Push extra options
        self.apos.push.browserCall('user', 'apos.create(? , ?)', 'dynamic-table-utils', myOptions.browser)
    }
}