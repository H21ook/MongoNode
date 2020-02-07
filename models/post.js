const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema);