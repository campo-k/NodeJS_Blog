var express = require('express');
var router = express.Router();
var PostModel = require('../models/PostModel');

/* GET home page. */
router.get('/', function(req, res, next) {
    PostModel.find({} , function(err, posts){
        res.render('./index', { posts : posts });
    });
});

module.exports = router;
