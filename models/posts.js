/*
 *
 * Model to manage all. Here are made all db actions.
 *
 **/
module.exports = function( req, res ) {

    this.req = req;
    this.res = res;
    this.mongoose = require('mongoose');

    this._constructor = function(){
        this._connect();
    };

    this._connect = function(){
        if ( !this.mongoose.connections[0].base.connections[0]._hasOpened ) this.mongoose.connect('mongodb://localhost/test');
    };

    this.set = function( key, value ){
      this[key] = value;
    };

    this.newPost = function(){
        var self = this;
        var model_posts = self.mongoose.model('posts');
        var posts = new model_posts({
            user_id:1,
            category_id:1,
            title: self.req.param('post_title', ''),
            body: self.req.param('post_text', '')
        });
        posts.save(function (err) {
                if ( !err ){
                    self.req.session.successMessage = 'Post inserted!';
                    self.res.redirect('/');
                }
                else{
			self.res.writeHead(500, self.res.headers);
 			self.req.session.errorMessage = 'Fail on insert post!';
		}

        });
    };

    this.editPost = function(){
        var self = this;

        var model_posts = self.mongoose.model('posts');

        model_posts.update({_id: self.req.param('postId')}
            , {
                title: self.req.param('post_title', ''),
                body: self.req.param('post_text', '')
            }
            , {upsert: true}
            , function( err ){
                if ( !err ){
                    self.req.session.successMessage = 'Post updated!';
                    self.res.redirect('/post/' + self.req.param('postId'));
                }
                else{
                    self.req.session.errorMessage = 'Fail on update post!';
                    self.res.redirect('/');
                }
            }
        );
    };
    this.deletePost = function(){
        var self = this;

        var model_posts = self.mongoose.model('posts');

        model_posts.remove({ _id: self.req.params.id }, function(err) {
            if (!err){
                self.req.session.successMessage = 'Post deleted!';
            }
            else{
                self.req.session.errorMessage = 'Fail on delete post!';
            }
            self.res.redirect('/');
        });
    };
    this.getPostRow = function( callback, error, scope ){
        var self = this;

        var model_posts = self.mongoose.model('posts');

        model_posts.findById(self.req.params.id, function (err, docs) {
            if ( !err ){
                callback.call(scope, docs);
            }
            else{
                self.res.statusCode = 500;
                self.res.redirect('/');
                //error.call(scope, err);
            }
        });
    };
    this.getPostRecord = function( callback, error, scope ){
        var self = this;

        var Schema = self.mongoose.Schema
        , ObjectId = Schema.ObjectId;

        var BlogPost = new Schema({
            author    : ObjectId
            ,
            title     : String
            ,
            body      : String
            ,
            date      : Date
        });


        var model_posts = self.mongoose.model('posts', BlogPost);

        model_posts.find({}, function (err, docs) {
            if ( !err ){
                callback.call(scope, docs);
            }
            else error.call(scope, err);
        });
    };

    //-------------------------
    this._constructor();

}
