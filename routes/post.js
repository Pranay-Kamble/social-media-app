import express from 'express'
import Post from '../models/post.js'
import Comment from '../models/comment.js'
import methodOverride from "method-override";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import AppError from "../utils/AppError.js"
import joi from "joi"
import requireLogin from "../middleware/requireLogin.js";
import isPostAuthor from "../middleware/isPostAuthor.js"

const postRoutes = express.Router();
postRoutes.use(methodOverride('_method'));

postRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const postData = await Post.find({});
    res.render('newWeb/posts/posts', {postData})
}))

postRoutes.get('/create',  requireLogin, (req, res) => {
    res.render('newWeb/posts/create-post');
})

postRoutes.get('/:id', asyncErrorHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById({_id: postId});
    if (!post) {
        req.flash('error', 'Post not found');
        res.redirect('/posts');
        return;
    }
    const postComments = await Comment.find({postId: postId}).populate('authorId');
    console.log(postComments);
    res.render('newWeb/posts/post-view', { post, postComments })
}))

postRoutes.post('/create', requireLogin, asyncErrorHandler(async (req, res) => {

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
    newPost.mediaIncluded = []; //empty for now, later add them to list through form data

    newPost.dateCreated = newPost.dateUpdated =  new Date(Date.now()).toISOString();
    delete newPost.file;
    console.log(newPost);

    const newPostObject = new Post({...newPost});
    await newPostObject.save()

    const id = newPostObject._id;
    req.flash('success', 'Successfully created the post!')
    res.redirect(`/posts/${id}`);
}))

postRoutes.get('/:id/edit', requireLogin, isPostAuthor, (async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findById({_id: postId});

    res.render('newWeb/posts/edit', { post });
}))

postRoutes.put('/:id/edit', requireLogin, isPostAuthor, asyncErrorHandler(async (req, res) => {
    const postId = req.params.id;
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

    await Post.findByIdAndUpdate({_id: postId}, {...formData, dateUpdated: new Date().toISOString()});
    req.flash('success', 'Edit was successful')
    res.redirect(`/posts/${postId}`);
}))

postRoutes.delete('/:id/delete', requireLogin, isPostAuthor, (async (req, res) => {
    const postId = req.params.id;
    await Post.findByIdAndDelete({_id: postId});
    req.flash('success', 'Post deleted successfully')
    res.redirect(`/posts`);
}))

export default postRoutes;