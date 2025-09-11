import Comment from "../models/comment.js";

const getPostComments = async (req, res) => {
    const {postId} = req.params;
    const comments = await Comment.find({postId}).populate('creatorId', 'username _id');
    res.send(comments);
}

const getComment = async (req, res) => {
    const commentId = req.params.id;
    const commentData = await Comment.find({commentId});
    res.send(commentData);
}

const addComment = async (req, res) => {
    const {postId} = req.params;
    const {content} = req.body;
    if (content) {
        await Comment.create({postId, content, creatorId: req.user._id});
        req.flash('success', 'Comment added!')
    }else {
        req.flash('error', 'Comment cannot be empty');
    }
    res.redirect(`../../posts/${postId}`);
}

const deleteComment = async (req, res) => {
    const commentId = req.params.commentId
    const {postId} = await Comment.findByIdAndDelete(commentId);

    req.flash('success', 'Deleted comment')
    res.redirect(`../../posts/${postId}`);
}

export default {deleteComment, addComment, getPostComments, getComment};