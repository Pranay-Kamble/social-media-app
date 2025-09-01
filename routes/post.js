import express from 'express'
import Post from '../models/post.js'
import Comment from '../models/comment.js'
import methodOverride from "method-override";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import AppError from "../utils/AppError.js"
import joi from "joi"

const postRoutes = express.Router();
postRoutes.use(methodOverride('_method'));

postRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const postData = await Post.find({});
    res.render('newWeb/posts/posts', {postData})
}))

postRoutes.get('/create',  (req, res) => {
    res.render('newWeb/posts/createPost');
})
//**************************
//make this a protected route, allow only when user is valid or send them to signin or signup
//**************************


postRoutes.get('/:id', asyncErrorHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById({_id: postId});
    if (!post) {
        req.flash('error', 'Post not found');
        res.redirect('/posts');
        return;
    }
    const postComments = await Comment.find({postId: postId});

    res.render('newWeb/posts/postView', { post, postComments })
}))

postRoutes.post('/create', asyncErrorHandler(async (req, res) => {

    //Check if it is coming from a valid login session, else anyone can add a post through postman
    //Proper middleware has to be implemented

    console.log("Received POST request");
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

    newPost.creatorId ='68457e1e9af6e7e879c1819e'; //fixed for now, later after implementing auth we will change it dynamically
    newPost.mediaIncluded = []; //empty for now, later add them to list through form data

    newPost.dateCreated = newPost.dateUpdated =  new Date(Date.now()).toISOString();
    delete newPost.file;
    console.log(newPost);

    const newPostObject = new Post({...newPost});
    await newPostObject.save()
    console.log(newPostObject);

    const id = newPostObject._id;
    req.flash('success', 'Successfully created the post!')
    res.redirect(`/posts/${id}`);
}))

postRoutes.get('/:id/edit', asyncErrorHandler(async (req, res) => {

    //User can only edit a post if the post has been created by the user and user has a valid login session

    const postId = req.params.id;
    const post = await Post.findById({_id: postId});
    res.render('newWeb/posts/edit', { post });
}))

postRoutes.put('/:id/edit',  asyncErrorHandler(async (req, res) => {

    //again same, post should be from same user and user must have valid login session

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

    const updatedPost = await Post.findByIdAndUpdate({_id: postId}, {...formData, dateUpdated: new Date().toISOString()});
    req.flash('success', 'Edit was successful')
    res.redirect(`/posts/${postId}`);
}))

postRoutes.delete('/:id/delete', asyncErrorHandler(async (req, res) => {
    //implement proper middleware function

    const postId = req.params.id;
    const post = await Post.findByIdAndDelete({_id: postId});
    req.flash('success', 'Post deleted successfully')
    res.redirect(`/posts`);
}))

export default postRoutes;