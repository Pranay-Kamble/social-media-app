import Post from "../models/post.js";
import Comment from "../models/comment.js";
import joi from "joi";
import AppError from "../utils/AppError.js";
import { cloudinary } from '../cloudinary/index.js'

const home = async (req, res) => {
    const postData = await Post.find().populate('creatorId', 'username _id');
    console.log(postData);
    res.render('newWeb/posts/posts', {postData})
}

const renderCreatePost = (req, res) => {
    res.render('newWeb/posts/create-post');
}

const renderPost = async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById({_id: postId}).populate('creatorId', 'username _id');
    if (!post) {
        req.flash('error', 'Post not found');
        res.redirect('/posts');
        return;
    }
    const postComments = await Comment.find({postId}).populate('creatorId', 'username _id');
    console.log(postComments);
    res.render('newWeb/posts/post-view', { post, postComments })
}

const createPost = async (req, res) => {

    const formData = req.body;

    const postSchema = joi.object({
        title: joi.string().required().min(1),
        content: joi.string()
    })
    const { error } = postSchema.validate(formData);

    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new AppError(msg, 400)
    }

    const newPost = {...formData};
    newPost.commentsCount = newPost.downvotes = newPost.upvotes = newPost.score = 0

    newPost.creatorId = req.user._id;
    newPost.mediaIncluded = req.files.map(f => ({url: f.path, filename: f.filename}));

    newPost.dateCreated = newPost.dateUpdated =  new Date(Date.now()).toISOString();
    console.log(newPost);

    const newPostObject = new Post({...newPost});
    await newPostObject.save();

    const id = newPostObject._id;
    req.flash('success', 'Successfully created the post!')
    res.redirect(`/posts/${id}`);
}

const renderEdit = async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById({_id: postId});

    res.render('newWeb/posts/edit', { post });
}

const editPost = async (req, res) => {
    const postId = req.params.id;
    const formData = req.body;
    console.log(req.body);
    const postSchema = joi.object({
        title: joi.string().required().min(1),
        content: joi.string(),
        deleteImages: joi.array()
    })
    const { error } = postSchema.validate(formData);

    if (error) {
        const msg = error.details.map(er => er.message).join(',');
        throw new AppError(msg, 400)
    }

    console.log(req.body.deleteImages);
    if (req.body.deleteImages) {
        for (let imgName of req.body.deleteImages) {
            console.log(imgName);
            console.log(await cloudinary.uploader.destroy(imgName));
        }
        await Post.updateOne({_id: postId}, {$pull: { mediaIncluded : { filename: {$in: req.body.deleteImages }}}});
    }

    const updatePost = await Post.findByIdAndUpdate({_id: postId}, {...formData, dateUpdated: new Date().toISOString()});
    const newImages = req.files.map(f => ({url: f.path, filename: f.filename}));
    updatePost.mediaIncluded.push(...newImages);
    updatePost.save();
    req.flash('success', 'Edit was successful')
    res.redirect(`/posts/${postId}`);
}

const deletePost = async (req, res) => {
    const postId = req.params.id;
    await Post.findByIdAndDelete({_id: postId});
    req.flash('success', 'Post deleted successfully')
    res.redirect(`/posts`);
}

export default {deletePost, editPost, renderEdit, createPost, renderPost, renderCreatePost, home}