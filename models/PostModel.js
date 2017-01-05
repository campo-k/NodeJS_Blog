var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrease = require('mongoose-auto-increment');
var virtual = require('../libs/virtualLib');

var postSchema = new schema({
    title: {
        type:String,
        required:[true, "필수 항목입니다."]
    },
    content: String,
    thumbnail: String,
    created_at: {
        type: Date,
        default: Date.now()
    },
    username: String
});

postSchema.virtual('getDate').get(virtual.virtualDate);
postSchema.plugin(autoIncrease.plugin, 
    {model: 'post', field:'id', startAt:1}
);
module.exports = mongoose.model('post', postSchema);