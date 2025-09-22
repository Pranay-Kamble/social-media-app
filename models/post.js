import mongoose from 'mongoose'
import Comment from './comment.js'
import {cloudinary} from "../cloudinary/index.js";

const image = mongoose.Schema({
    url: String,
    filename: String
})

image.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_400');
})

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
        ref: 'User',
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
        type: [ image ]
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

    const { mediaIncluded } = deletedPost;
    if (mediaIncluded) {
        for (let img of mediaIncluded) {
            await cloudinary.uploader.destroy(img.filename);
        }

        console.log("Mongo Middleware: Deleted all included images from " + deletedPost._id);
    }
})

const Post = mongoose.model('Post', post);

export default Post;