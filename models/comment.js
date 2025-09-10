import mongoose from 'mongoose'


const comment = mongoose.Schema({
    postId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    authorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content : {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    isEdited: {
        type: Boolean
    }
})

const Comment = mongoose.model('Comment', comment);
export default Comment;