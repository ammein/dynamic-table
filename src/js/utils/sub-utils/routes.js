let routes = function(self, options) {
    self.getFieldsApi = function (query, callback) {
        return $.get('/modules/dynamic-table/get-fields', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }
            return callback(data.message);
        })
    }

    self.resetCallbacksApi = function (query, callback) {
        return apos.modules['dynamic-table'].api('reset-callbacks', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }

            return callback(data.message);
        })
    }

    self.updateFieldsApi = function (query, callback) {
        return apos.modules['dynamic-table'].api('update-fields', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message)
            }
            return callback(data.message);
        })
    }

    self.removeUrlsApi = function (query, callback) {
        return apos.modules['dynamic-table'].api('remove-urls', query, function (data) {
            if (data.status === 'success') {
                return callback(null, data.message);
            }

            return callback(data.message);
        })
    }
}

export default routes;