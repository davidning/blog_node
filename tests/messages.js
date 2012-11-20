var assert = require('assert')
  , modelMessage = require('../models/messages');

suite('Routing', function() {
  test('Test routes', function( done ) {
	var message = new modelMessage({session:{successMessage:'Inserted with success'}});  	
    assert.equal('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button>Inserted with success</div>', message.getMessage());
	message.req = {session:{warningMessage:'Some fail on insert'}};
	assert.equal('<div class="alert alert-block"><button type="button" class="close" data-dismiss="alert">×</button>Some fail on insert</div>', message.getMessage());
	message.req = {session:{errorMessage:'Error on insert'}};
	assert.equal('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>Error on insert</div>', message.getMessage());	
    done();
  });
});