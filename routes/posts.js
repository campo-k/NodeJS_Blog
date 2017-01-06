var express = require('express');
var router = express.Router();
var postModel = require("../models/PostModel");
var commentModel = require('../models/commentModel');
var loginRequired = require('../libs/loginRequired');

var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({extended: false});

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' );
var fs = require('fs');

//multer 셋팅
var multer  = require('multer');
var storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) {
        callback(null, 'posts-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });


function myMiddle (req, res, next) {
    req.test =  "kbs / " + new Date();
    next();
}


/* GET home page. */
router.get('/', myMiddle, function(req, res, next) {
    console.log(req.test);
    postModel.find({}, function (err, posts) {
        res.render('posts/list', {posts: posts});
    });
});
router.get('/detail/:id', function(req, res) {
    postModel.findOne({ id: req.params.id}, function(err, post) {
        commentModel.find({ post_id: req.params.id }, function(err, comments) {
            res.render('posts/detail', {post: post, comments: comments});
        })
    });
});


router.get('/edit/:id', loginRequired, parseForm, csrfProtection, function(req,res) {
    postModel.findOne({id: req.params.id}, function(err, post) {
        res.render('posts/edit', {post: post, csrfToken: req.csrfToken()});
    })
});
router.post('/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, function(req,res) {
    postModel.findOne({id:req.params.id}, function(err, post) {
        if (req.file) {
            fs.unlinkSync(uploadDir + '/' + post.thumbnail);
        }

        var query = {
            title: req.body.title,
            content: req.body.content,
            thumbnail: (req.file) ? req.file.filename: post.thumbnail
        };

        postModel.update({id:req.params.id},{$set: query},function(err) {
            res.redirect('/posts/detail/' + req.params.id);
        });
    });
});


router.get('/write', loginRequired, parseForm, csrfProtection, function(req, res) {
    var post = {};
    res.render('posts/edit', {post: post, csrfToken: req.csrfToken()});
});
router.post('/write', loginRequired, upload.single('thumbnail'), csrfProtection, function(req, res) {
    var post = new postModel({
        title: req.body.title,
        content: req.body.content,
        thumbnail: (req.file) ? req.file.filename: "",
        username: req.user.username
    });

    var validationError = post.validateSync();
    if(!validationError) {
        post.save(function(err){
            res.redirect('/posts');
        });
    }
});


router.get('/delete/:id', function(req, res) {
    postModel.remove({id: req.params.id}, function(err) {
        res.redirect('/posts');
    });
});


router.post('/ajax_comment/insert', function(req, res) {
    var comment = new commentModel({
        content: req.body.content,
        post_id: parseInt(req.body.post_id)
    }); 
    comment.save(function(err, commnet) {
        res.json({
            message: "success",
            id:comment.id,
            content: comment.content
        });
    });
});
router.post('/ajax_comment/delete', function(req, res){
    if(req.xhr){ //ajax 일때만 응답
        CommentModel.remove({ id : parseInt(req.body.comment_id) } , function(err){
            res.json({ message : "success" });
        });
    }else{
        res.status(404).send('Not found');
    }
});


module.exports = router;