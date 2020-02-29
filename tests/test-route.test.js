const assert = require('assert');
const async = require('async');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');

describe('Dynamic Table: Routes Test', function() {
    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(50000);
    var dummyUser;

    after(function(done) {
        try {
            require('apostrophe/test-lib/util').destroy(apos, done);
        } catch (e) {
            console.warn('Old version of apostrophe does not export test-lib/util library, just dropping old test db');
            apos.db.dropDatabase();
            setTimeout(done, 1000);
        }
    })
})