/* eslint-disable standard/no-callback-literal */
/* eslint-disable no-var */
const _ = require('lodash');
module.exports = function(self, options) {
    self.route('post', 'remove-urls', function (req, res) {
        return self.routes.removeUrls(req, function (err) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                })
            }

            return res.send({
                status: 'success',
                message: 'Successfully remove widget location'
            })
        })
    })

    self.route('post', 'update-urls', function (req, res) {
        return self.routes.updateUrls(req, function (err) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                })
            }

            return res.send({
                status: 'success',
                message: 'Piece updated !'
            })
        })
    })

    self.route('post', 'reset-callbacks', function (req, res) {
        return self.routes.resetCallbacks(req, function (err) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                })
            }

            return res.send({
                status: 'success',
                message: 'Callback Reset !'
            })
        })
    })

    self.route('post', 'reset-options', function (req, res) {
        return self.routes.resetOptions(req, function (err) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                })
            }

            return res.send({
                status: 'success',
                message: 'Options Reset !'
            })
        })
    })

    self.route('get', 'get-fields', function (req, res) {
        return self.routes.getFields(req, function (err, result) {
            if (err) {
                return res.send({
                    status: 'error',
                    message: err
                })
            }

            return res.send({
                status: 'success',
                message: result
            })
        })
    })

    self.routes.resetCallbacks = function (req, callback) {
        if (!req.body.id) {
            // eslint-disable-next-line standard/no-callback-literal
            return callback('Id not found');
        }

        var criteria = {
            _id: req.body.id
        }

        return self.find(req, criteria).toObject(function (err, result) {
            if (err) {
                return callback(err);
            }

            var newPiece = _.cloneDeep(result);
            // Find Choices in callbacks checkboxes showFields

            var choices = self.tableSchemas.filter((val, i) => val.group.name === 'callbacks')

            // Loop each choices that matched with results. Then delete it on newPiece object
            choices.forEach(function (val, i, arr) {
                if (Object.getOwnPropertyNames(newPiece).includes(val.name)) {
                    delete newPiece[val.name];
                }
            })

            delete newPiece['callbacks'];

            // Update it!
            return self.update(req, newPiece, {
                permissions: false
            }, callback);
        })
    }

    self.routes.resetOptions = function(req, callback) {
        if (!req.body.id) {
            return callback('Id not found');
        }

        var criteria = {
            _id: req.body.id
        }

        return self.find(req, criteria).toObject(function(err, result) {
            if (err) {
                return callback(err);
            }

            var newPiece = _.cloneDeep(result);

            delete newPiece['tabulatorOptions'];

            return self.update(req, newPiece, {
                permissions: false
            }, callback);
        })
    }

    self.routes.removeUrls = function (req, callback) {

        if (!req.body.id) {
            // eslint-disable-next-line standard/no-callback-literal
            return callback('Id not found')
        }

        var criteria = {
            _id: req.body.id
        };

        return self.find(req, criteria).toObject(function (err, result) {
            if (err) {
                return callback(err);
            }

            var filter = null;

            var newPiece = _.cloneDeep(result);
            newPiece.id = req.body.id;
            if (Array.isArray(req.body.url)) {
                filter = result.url.reduce((init, next, i) => init.concat({
                    id: next.id,
                    widgetLocation: req.body.url.filter((val, i) => next.widgetLocation === val)[0]
                }), []).filter((val, i) => val.widgetLocation);
            } else {
                /**
                 * Error on delete widgetLocation if it has the same table name and same page
                 *{
                     id: "ck7lj559q0008a83d6wemyxqf",
                     widgetLocation: "/"
                 }
                 {
                     id: "ck7lj59vw000da83d4nqpfojh",
                     widgetLocation: "/"
                 }
                 */
                filter = result.url.filter((val, i) => val && val.widgetLocation !== req.body.url && val.id === req.body.id);
            }
            newPiece.url = filter;
            newPiece.published = true;

            return self.update(req, newPiece, {
                permissions: false
            }, callback);
        })
    }

    self.routes.updateUrls = function (req, callback) {

        if (!req.body.id) {
            return callback('Id not found')
        }

        var criteria = {
            _id: req.body.id
        };

        return self.find(req, criteria).toObject(function (err, result) {
            if (err) {
                return callback(err);
            }

            var newPiece = _.cloneDeep(result);
            newPiece.id = req.body.id;
            var filter = null;
            if (Array.isArray(result.url)) {
                filter = _.uniq(_.union(newPiece.url, [{
                    id: self.apos.utils.generateId(),
                    widgetLocation: req.body.url
                }]), 'url')
            } else {
                filter = result.url.filter((val, i) => val && val.widgetLocation === req.body.url);
            }
            newPiece.url = filter;
            newPiece.published = true;

            return self.update(req, newPiece, {
                permissions: false
            }, callback);
        })
    }

    self.routes.getFields = function (req, callback) {

        if (!req.query.id) {
            return callback('Id not found')
        }

        var allowFilterSchemas = self.tableSchemas.reduce((init, next, i) => Object.assign(init, init[next.name] = 1), {})

        var criteria = {
            _id: req.query.id
        };

        return self.find(req, criteria, allowFilterSchemas).toObject(function (err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result)
            }

            return callback('Table Not Matched');
        })
    }
}