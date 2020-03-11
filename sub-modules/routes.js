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

            var newPiece = _.cloneDeep(result);
            newPiece.id = req.body.id;
            const find = result.url.findIndex((val, i) => val && val.widgetId === req.body.id && val.widgetLocation === req.body.url);
            const filter = result.url.filter((val, i) => i !== find);
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
            newPiece.url = newPiece.url.length > 0 ? newPiece.url.concat({
                id: self.apos.utils.generateId(),
                widgetId: req.body.id,
                widgetLocation: req.body.url
            }) : [].concat({
                id: self.apos.utils.generateId(),
                widgetId: req.body.id,
                widgetLocation: req.body.url
            })
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