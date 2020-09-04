const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    author:{type: Schema.Types.ObjectId, ref:'users'},
    kind:{type: String, required:true},
    title:{ type: String, required:true },
    content:{ type: String, required:true },
    date:{ type: Date, default:Date.now() },
    post_image:{ type: String, required:true },
    auth_image:{ type: String, required:true },
    author_des:{ type: String, required:true },
})

module.exports = mongoose.model('Post',PostSchema)
