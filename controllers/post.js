/*
 *
 * Controller class of posts.
 * Here its received the request, call model and sent response.
 *
 **/

module.exports = function( req, res ) { 
    
    this.req = req;
    this.res = res;
    this.posts = null;
    this.comments = null;
    this.response = {
        title: 'Blog sample'        
    };
 
    this._constructor = function(){
        this._loadPosts();        
        this._loadComments();        
    };
 
    this._loadPosts = function(){
        this._factory('posts', '../models/posts.js');
    };
 
    this._loadComments = function(){
        this._factory('comments', '../models/comments.js', this.posts.mongoose || null);
    };
 
    this._factory = function( property, file, connection ){
        var class_model = require(file);
        this[property] = new class_model(this.req, this.res, connection);
    };

    this._response = function( docs ){ 
        var self = this;
        self.response['posts'] = docs;
        self.response['postId'] = self.req.params.id;
        self.sent('post');
    };
    this._responseError = function( err ){
        console.log('ERROR');
    };


    this._responseComments = function( docs ){
        var self = this;
        self.response['comments'] = docs;
    };

    this.index = function(){
        var self = this;
        
        self.comments.getCommentRecord(this._responseComments, this._responseError, this);
        setTimeout(function(){self.posts.getPostRow(self._response, self._responseError, self)},1000);
    };

    this._responseEdit = function( docs ){ 
        var self = this;
        self.response['posts'] = docs;
        self.response['postId'] = self.req.params.id;
        self.response['type'] = 'edit';
        self.sent('postEdit');
    };    
    this.showEditPost = function(){
        var self = this;        
        self.posts.getPostRow(this._responseEdit, this._responseError, this);        
    };
    
    this.removePost = function(){
        var self = this;
        
        self.posts.deletePost(this._response, this._responseError, this);        
    };
    
    this.newPost = function(){
        var self = this;     
        self.posts.set(req, self.req);
        self.posts.set(res, self.res);
        self.posts.newPost(this._response, this._responseError, this);  
    };
    
    this.editPost = function(){
        var self = this;     
        self.posts.set(req, self.req);
        self.posts.set(res, self.res);
        self.posts.editPost(this._response, this._responseError, this);  
    };
    
    this.newComment = function(){
        var self = this;     
        self.comments.newComment(this._response, this._responseError, this);
    };

    this.editComment = function(){
        var self = this;
        self.comments.editComment(this._response, this._responseError, this);
    };

    this.deleteComment = function(){
        var self = this;
        self.comments.deleteComment(this._response, this._responseError, this);
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

