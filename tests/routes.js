var express = require('express')
, assert = require('assert')
, config = require('../config/settings')    
, http = require('supertest')
, should = require('should')
, path = require('path')

/* CREATE SERVER WITH SAME CONFIG */
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || config.port);
    app.set('views', __dirname  + '/..' + config.view_folder);
    app.set('view options', {
        pretty: true
    });
    app.set('view engine', config.view_engine);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.cookie));
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + config.static_folder));
    app.use(express.static(path.join(__dirname, config.static_folder)));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});
require('../config/routes.js')(app);

describe('Routing system', function(){
    var post_id = "123";//some id, fake to create error
    it('Get index page - required 200 OK', function(done){
        console.log('Get index page - expected 200 OK');
        http(app).get('/').expect(200, done);
    })
    it('Post index page - Fail test', function(done){
        console.log('Post index page - expected 404');
        http(app).post('/').expect(404, done);
    })
    it('Get post page - Success test', function(done){
        console.log('Get post page - expected 302 because redirect');
        http(app).get('/post/' + post_id).expect(302, done);
    })

    it('Post new - Success text', function(done){
        console.log('Get post page - expected 302 because redirect');
        http(app).post('/post/new').send( {
            post_title: 'New post',
            post_text:"new post text"
        } ).expect(302, done);
    })    
    it('Get edit - Success test', function(done){
        console.log('Post edit post page - expected 302 because redirect');
        http(app).get('/post/edit/' + post_id).send( {
            id: post_id
        } ).expect(302, done);
    })
    it('Post edit - required 302 OK', function(done){
        console.log('Post edit post page - expected 302 because redirect');
        http(app).post('/post/edit/').send( {
            postId: post_id,
            post_title: 'New post',
            post_text:"new post text"
        } ).expect(302, done);
    })
    
    it('Post post page - Fail test', function(done){
        console.log('Post post page - expected 500: Need sent fields');
        http(app).post('/post/' + post_id).expect(500, done);
    })
    
    it('Post new comment - Success test', function(done){
        console.log('Post new comment - expected 302 because redirect');
        http(app).post('/post/' + post_id).send( {
            postId: post_id,
            comment_title: 'New comment',
            comment_text:"New comment text"
        } ).expect(302, done);
    })

    it('Post edit comment - Success test', function(done){
        console.log('Post edit comment - expected 302 because redirect');
        http(app).post('/post/' + post_id).send( {
            postId: post_id,
            type: 'edit',
            comment_title: 'New comment',
            comment_text:"New comment text"
        } ).expect(302, done);
    })

    it('Post delete comment - Fail test', function(done){
        console.log('Post delete comment - expected 500 because wrong headers');
        http(app).post('/post/' + post_id).send( {
            postId: post_id,
            commentId: '123123',
            type: 'edit',
            post_title: 'New post',
            post_text:"new post text"
        } ).expect(500, done);
    })
    
})

