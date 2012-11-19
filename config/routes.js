module.exports = function(app) {
    
    app.get('/', function(req, res){
        var routes = require('../controllers/index');
        routes = new routes(req, res);
        routes.index();             
    });
    app.get('/post/new', function(req, res){
        res.render('postEdit', {title: 'Blog sample', alert_message:'', postId: '', posts:{title:'', body:''}, type:'new'});
    });    
    app.get('/post/edit/:id', function(req, res){
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        post.showEditPost();
    });    
    app.get('/post/delete/:id', function(req, res){
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        post.removePost();
    });    
    app.get('/post/:id', function(req, res){
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        post.index();
    });    
    app.post('/post/new', function(req, res){        
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        post.newPost();
    });      
    app.post('/post/edit', function(req, res){        
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        post.editPost();
    });      
    app.post('/post/:id', function(req, res){
        var routes = require('../controllers/post');
        var post = new routes(req, res);
        var type = req.param('type', "new");
        if ( type=="delete" ) post.deleteComment();
        else if ( type=="edit" ) post.editComment();
        else post.newComment();
    });      
};
