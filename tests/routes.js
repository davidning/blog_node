var request = require('supertest')
  , app     = require('./anExpressServer').app
  , assert  = require("assert");

describe('POST /', function(){
  it('should fail bad img_uri', function(done){
    request(app)
        .post('/')
        .send({
            'img_uri' : 'foobar'
        })
        .expect(500)
        .end(function(err, res){
            done();
        })
  })
});