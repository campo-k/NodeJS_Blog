var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var commentSchema = new Schema({
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    },
    post_id : Number //save PostModel Primary Key
});

commentSchema.plugin( autoIncrement.plugin , { model : "comment", field : "id" , startAt : 1 } );
module.exports = mongoose.model('comment' , commentSchema);