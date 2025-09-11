import Comment from '../models/comment.js'

const isCommentAuthor = async (req, res, next) => {
    const {commentId} = req.params;
    const {authorId, postId} = await Comment.findById(commentId);

    if (!(req.user._id.equals(authorId))) {
        req.flash('error', 'Not allowed to delete the comment');
        return res.redirect(`/posts/${postId}`);
    }

    next();
}

export default isCommentAuthor;