const assert = require('assert');
const async = require('async');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');

var _id = "";
var tableTheme = "bootstrap4";
var tabulatorOptions = {
    height: "300px"
}

describe('Dynamic Table: Pieces Test', function () {
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
                'dynamic-table': {
                    theme: tableTheme,
                    tabulatorOptions
                },
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

    it('should have the theme inserted', function (done) {
        expect(apos.modules['dynamic-table'].options).toMatchObject(expect.objectContaining({
            theme: tableTheme
        }))
        done();
    });

    it('should have all tabulatorOptions inserted', function(done) {
        expect(apos.modules['dynamic-table'].options).toMatchObject(expect.objectContaining({
            theme: tableTheme,
            tabulatorOptions
        }))
        done();
    })
})