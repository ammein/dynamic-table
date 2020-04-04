const assert = require('assert');
const async = require('async');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');

var _id = "";
var newTable = {
    title: "Table 1",
    slug: "table1"
}

describe('Dynamic Table: Routes Test', function () {
    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(50000);
    var dummyUser;

    after(function (done) {
        try {
            require('apostrophe/test-lib/util').destroy(apos, done);
        } catch (e) {
            console.warn('Old version of apostrophe does not export test-lib/util library, just dropping old test db');
            apos.db.dropDatabase();
            setTimeout(done, 1000);
        }
    })

    it('should be a property of the apos object', function (done) {
        apos = require('apostrophe')({
            // Make it `module` to be enabled because we have pushAssets method called
            root: process.platform === "win32" && !process.env.TRAVIS ? module : undefined,
            testModule: true,
            baseUrl: 'http://localhost:7000',
            modules: {
                'apostrophe-express': {
                    port: 6000
                },
                'dynamic-table': {},
                'dynamic-table-widgets': {}
            },
            afterInit: function (callback) {
                assert(apos.schemas);
                assert(apos.modules['dynamic-table']);
                assert(apos.modules['dynamic-table-widgets']);
                assert(apos.users.safe.remove);
                return apos.users.safe.remove({}, callback);
            },
            afterListen: function (err) {
                assert(!err);
                done();
            }
        });
    });

    it('should create new simple table', function (done) {
        var table = _.assign(apos.modules['dynamic-table'].newInstance(), newTable);

        apos.modules['dynamic-table'].insert(apos.tasks.getReq(), table, function (err, result) {
            id = result._id;
            assert(!err);
            done();
        })
    });

    it('should get the simple table successfully', function (done) {
        return apos.modules['dynamic-table'].find({
            "_id": id
        }).toObject(function (err, piece) {
            assert(!err);
            expect(piece).toMatchObject(expect.objectContaining(newTable));
            expect(piece).not.toBeFalsy();
            done();
        })
    })

    it('should make sure everything is published and out of the trash for test purposes', function (done) {
        return apos.docs.db.update({}, {
            $set: {
                published: true,
                trash: false
            }
        }, {
            multi: true
        }, function (err, count) {
            assert(!err);
            done();
        })
    })

    it('should delete simple table upon successful created', function (done) {
        return apos.docs.db.remove({
            "_id": id
        }, function (err, result) {
            assert(!err);
            expect(result.result).toMatchObject({
                n: 1,
                ok: 1
            })
            return apos.modules['dynamic-table'].find({
                "_id": id
            }).toObject(function (errPiece, piece) {
                expect(piece).toBeFalsy();
                assert(!errPiece);
                done();
            })
        });
    })
})