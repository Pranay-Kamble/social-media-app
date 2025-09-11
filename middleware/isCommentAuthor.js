import Comment from '../models/comment.js'

const isCommentAuthor = async (req, res, next) => {
    const {commentId} = req.params;
    const {creatorId, postId} = await Comment.findById(commentId);

    if (!(req.user._id.equals(creatorId))) {
        req.flash('error', 'Not allowed to delete the comment');
        return res.redirect(`/posts/${postId}`);
    }

    next();
}

export default isCommentAuthor;