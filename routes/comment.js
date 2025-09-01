import express from 'express'
import Comment from '../models/comment.js'
//Only to send data to posts, wed will not have any pages for this
const commentRoutes = express.Router();

commentRoutes.get('/posts/:postId', async (req, res) => {
    console.log("Hit on comments post")
    const postId = req.params.postid;
    const comments = await Comment.find({postId: postId});
    res.send(comments);
})

commentRoutes.get('/:id', async (req, res) => {
    const commentId = req.params.id;
    const commentData = await Comment.find({commentId: commentId});
    res.send(commentData);
})

commentRoutes.post('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const formData = req.body;
    if (formData.content) {
        const newComment = await Comment.create({postId: postId, content: formData.content});
    }
    console.log("Hit on post route for comments")
    req.flash('success', 'Comment added!')
    res.redirect(`../../posts/${postId}`);
})

commentRoutes.delete('/:commentId/delete', async (req, res) => {
    console.log("Hit on delete comment route for comment")
    const commentId = req.params.commentId
    const comment = await Comment.findByIdAndDelete(commentId);
    const postId = comment.postId;
    req.flash('success', 'Deleted comment')
    res.redirect(`../../posts/${postId}`);
})

export default commentRoutes;