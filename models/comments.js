module.exports = function( req, res, connection ) {
    
    this.req = req;
    this.res = res;
    this.mongoose = connection || require('mongoose');

    this.set = function( key, value ){
      this[key] = value;  
    };
    
    this.newComment = function(){
        var self = this;

        var CommentsModel = self.mongoose.model('comments');
        var post_id = self.req.param('postId', 0);
        var posts = new CommentsModel({
            user_id:1, 
            parent_id: self.req.param('parentId', 0),
            post_id: post_id,
            title: self.req.param('comment_title', ''), 
            body: self.req.param('comment_text', '')
        });
        posts.save(function (err) {
                if ( !err ){
                    self.req.session.successMessage = 'Comment updated!';
                    self.res.redirect('/post/' + self.req.param('postId', ''));
                }
                else{
                    self.req.session.errorMessage = 'Fail on update comment!';
                    self.res.redirect('/');
                }            
        });         
    };
    
    this.editComment = function(){
        var self = this;

        var CommentsModel = self.mongoose.model('comments');
        CommentsModel.update({_id: self.req.param('commentId')}
            , {
                title: self.req.param('comment_title', ''),
                body: self.req.param('comment_text', '')
            }
            , {upsert: true}
            , function( err ){
                if ( !err ){
                    self.req.session.successMessage = 'Comment updated!';
                    self.res.redirect('/post/' + self.req.param('postId', ''));
                } 
                else{
                    self.req.session.errorMessage = 'Fail on update comment!';
                    self.res.redirect('/');
                }
            }
        );       
    };
    this.deleteComment = function(){
        var self = this;

        var CommentsModel = self.mongoose.model('comments');

        CommentsModel.find({ $or: [ {_id: self.req.params.id}, {parent_id: self.req.params.id} ] }, function (err, docs) {
            if (!err){
                if ( docs instanceof Array ){
                    for( var i in docs ){
                        CommentsModel.remove({ _id: docs[i]._id}, function(err) {});
                    }
                }
                else CommentsModel.remove({ _id: docs._id}, function(err) {});
                self.req.session.successMessage = 'Comment deleted!';
                self.res.redirect('/post/' + self.req.param('postId', ''));
            }
            else{
                self.req.session.errorMessage = 'Fail on delete comment!';
                self.res.redirect('/');
            }
        });         
    };
    this._loadTreeComments = function( docs, result, parent_id, callback, scope ){
        var self = this;
        var parent_id = parent_id || 0;
        var result = result || [];
        for ( var i in docs ){
            var c_val = docs[i];
            if ( c_val.parent_id==parent_id ){
                result.push(c_val);
                delete docs[i];
                result = self._loadTreeComments(docs, result, c_val._id);
            }
            else if ( parent_id=='0' ){
                result.push(c_val);
                delete docs[i];
            }
            
        }
        if ( parent_id=="0" ){

        }
        return result;
    };

    this.getCommentRecord = function( callback, error, scope ){
        var self = this;
        
        var Schema = self.mongoose.Schema
        , ObjectId = Schema.ObjectId;

        var Comment = new Schema({
            parent_id  :  { type: String, index: true, 'default':"0" }
          , post_id   :  { type: String, index: true }
          , user_id   :  { type: Number, index: true }
          , title   :  { type: String }
          , body  :  { type: String }
          , created_on  :  { type: Date, 'default': Date.now }
        });
        var CommentsModel = self.mongoose.model('comments', Comment);
        
        CommentsModel.find({}, function (err, docs) {            
            if ( !err ){
                var res = self._loadTreeComments(docs, null, null, callback, scope);                
                callback.call(scope, res);
            } 
            else error.call(scope, err);
        });    
    };
   
}
