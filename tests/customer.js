var customer = require('../controllers/Costumer');
var should = require("should")
describe("Customers", function(){
  it("retrieves by email", function(done){
    customer.findByEmail('test@test.com', function(doc){
    	console.log(doc, doc.email.should);
      doc.email.should.equal('test@test.com');
      done();
    });
  });
});