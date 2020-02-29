const _ = require('lodash');
module.exports = function (self, options) {
    let superAfterSave = self.afterSave;
    self.afterSave = function (req, piece, options, callback) {
        let newPiece = _.cloneDeep(piece);

        // Only delete if piece contains null value
        newPiece = Object.keys(newPiece).reduce((init, next) => {
            return Object.assign({}, init, newPiece[next] !== null ? { [next]: newPiece[next] } : {})
        }, {})

        return superAfterSave(req, newPiece, options, callback);
    }
}