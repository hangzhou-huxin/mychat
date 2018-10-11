var assert = require('assert');
var tools          = require('../commons/tools');

//以下是bdd的接口
describe('Tools', function() {
    describe('#bhash(pass,callback)', function() {
        it('should return -1 when the value is not present', function() {
            var pass =  "123456" ;
            var passhash = "" ;
            tools.bhash( pass, function (passhash) {
                console.log("passhash:" + passhash) ;
                console.log("pass:" + pass) ;
            });
            assert.notEqual(passhash,null, "不为空");
        });
    });
});