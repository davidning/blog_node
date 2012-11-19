/*
 *
 * Controller class of index page.
 * Here its received the request, call model and sent response.
 *
 **/

module.exports = function( req, res ) { 
    this.req = req;
    this.res = res;
    this.posts = null;
    this.response = {
        title: 'Blog sample'
        , message: ''
    };
 
    this._constructor = function(){
        this._factory();        
    };
 
    this._factory = function(){
        var class_model = require('../models/posts.js');
        this.posts = new class_model(this.req, this.res);
    };

    this._response = function( docs ){ 
        var self = this;
        self.response['posts'] = docs;
        self.sent('page');        
    };
    this._responseError = function( err ){
        console.log('ERROR');
    };

    this.index = function(){
        var self = this;        
        self.posts.getPostRecord(this._response, this._responseError, this);              
    };
    
    this.sent = function( page ){
        var self = this;
        var class_model = require('../models/messages.js');
        var message = new class_model(this.req);
        self.response['alert_message'] = message.getMessage(); 
        self.res.render(page, self.response);
    };
    
    this._constructor();
}
