let routes = function(self, options) {
    self.getFieldsApi = function (query, callback) {
        return $.get('/modules/' + self.options.apiModuleName + '/get-fields', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }
            return callback(data.message);
        })
    }

    self.resetCallbacksApi = function (query, callback) {
        return apos.modules[self.options.apiModuleName].api('reset-callbacks', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }

            return callback(data.message);
        })
    }

    self.resetOptionsApi = function (query, callback) {
        return apos.modules[self.options.apiModuleName].api('reset-options', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }

            return callback(data.message);
        })
    }

    self.updateFieldsApi = function (query, callback) {
        return apos.modules[self.options.apiModuleName].api('update-urls', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message)
            }
            return callback(data.message);
        })
    }

    self.removeUrlsApi = function (query, callback) {
        return apos.modules[self.options.apiModuleName].api('remove-urls', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }

            return callback(data.message);
        })
    }

    self.checkPermissions = function(query, callback) {
        return $.get('/modules/' + self.options.apiModuleName + '/check-permissions', query, function(data) {
            if (data.status === 'success') {
                return callback(data);
            }
            return callback(data);
        })
    }
}

export default routes;