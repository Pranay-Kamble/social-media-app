import mongoose from 'mongoose'
import Comment from './comment.js'

const post = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String
    },
    creatorId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    dateCreated : {
        type: Date,
        default: Date.now
    },
    dateUpdated : {
        type: Date
    },
    mediaIncluded : {
        type: [String] //Paths to the media files like images, videos in the storage disk
    },
    upvotes : {
        type: Number,
        default: 0
    },
    downvotes : {
        type: Number,
        default: 0
    },
    score : {
        type: Number,
        default: 0
    },
    commentsCount : {
        type: Number,
        default: 0
    }
});

//Middleware to delete all comments when a post is deleted
post.post('findOneAndDelete', async (deletedPost) => {
    if (deletedPost) {
        await Comment.deleteMany({postId: deletedPost._id});
    }
    console.log("Mongo Middleware: Deleted all comments of " + deletedPost._id);
})

const Post = mongoose.model('Post', post);

export default Post;