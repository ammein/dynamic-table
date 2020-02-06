const _ = require('lodash');
module.exports = function (self, options) {
    let superBeforeSave = self.beforeSave;
    self.beforeSave = function (req, piece, options, callback) {
        let newPiece = _.cloneDeep(piece);

        // Only delete if piece contains null value
        newPiece = Object.keys(newPiece).reduce((init, next) => {
            debugger;
            return Object.assign({}, init, newPiece[next] !== null ? { [next]: newPiece[next] } : {})
        }, {})

        return superBeforeSave(req, newPiece, options, callback);
    }
}