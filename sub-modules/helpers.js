const _ = require('lodash');
module.exports = function(self, options) {
    self.addHelpers('checkSchema', function(path, value) {
        if (Array.isArray(path)) {
            path = path.join('.');
        }
        if (Array.isArray(value)) {
            return _.find(value, path);
        } else {
            return path.split('.').reduce(function (xs, x) {
                return (xs && xs[x]) ? true : null
            }, value);
        }
    })
}