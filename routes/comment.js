import express from 'express'
import Comment from '../models/comment.js'
import requireLogin from "../middleware/requireLogin.js";
import isCommentAuthor from '../middleware/isCommentAuthor.js'
//Only to send data to posts, wed will not have any pages for this
const commentRoutes = express.Router();

commentRoutes.get('/posts/:postId', async (req, res) => {
    const {postId} = req.params;
    const comments = await Comment.find({postId}).populate('authorId');
    res.send(comments);
})

commentRoutes.get('/:id', async (req, res) => {
    const commentId = req.params.id;
    const commentData = await Comment.find({commentId});
    res.send(commentData);
})

commentRoutes.post('/posts/:postId', requireLogin, async (req, res) => {
    const {postId} = req.params;
    const {content} = req.body;
    if (content) {
        const newComment = await Comment.create({postId, content, authorId: req.user._id});
        req.flash('success', 'Comment added!')
    }else {
        req.flash('error', 'Comment cannot be empty');
    }
    res.redirect(`../../posts/${postId}`);
})

commentRoutes.delete('/:commentId/delete', requireLogin ,isCommentAuthor, async (req, res) => {
    const commentId = req.params.commentId
    const {postId} = await Comment.findByIdAndDelete(commentId);

    req.flash('success', 'Deleted comment')
    res.redirect(`../../posts/${postId}`);
})

export default commentRoutes;