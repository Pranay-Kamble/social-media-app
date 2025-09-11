import express from 'express'
import requireLogin from "../middleware/requireLogin.js";
import isCommentAuthor from '../middleware/isCommentAuthor.js'
import commentController from '../controllers/comment.js'
//Only to send data to posts, wed will not have any pages for this
const commentRoutes = express.Router();

commentRoutes.get('/posts/:postId', commentController.getPostComments);

commentRoutes.get('/:id', commentController.getComment);

commentRoutes.post('/posts/:postId', requireLogin, commentController.addComment);

commentRoutes.delete('/:commentId/delete', requireLogin ,isCommentAuthor, commentController.deleteComment);

export default commentRoutes;