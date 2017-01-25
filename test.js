/**
 * Created by muna on 25/01/17.
 */
var app        = require('./server');
var assert     = require('assert');
var superagent = require('superagent');

describe('server', function(){
    var server;

    beforeEach(function(){
        server = app().listen(3000);
    });

    afterEach(function () {
        server.close();
    });

    it('prints out "Hello, world!" when user goes to /', function(done){ //when a parameter is passed to the
        // function in 'it', node assumes that it's an async test, and calling 'done()' at the end
        // is how you tell mocha that your test has completed
        superagent.get('http://localhost:3000/', function(error, res){
            assert.ifError(error);
            assert.equal(res.status, 200);
            assert.equal(res.text, "Hello, world!");
            done();
        });
    });
});
