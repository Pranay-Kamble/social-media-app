import express from 'express'
import methodOverride from "method-override";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import requireLogin from "../middleware/requireLogin.js";
import isPostAuthor from "../middleware/isPostAuthor.js"
import postController from "../controllers/post.js"

const postRoutes = express.Router();
postRoutes.use(methodOverride('_method'));

postRoutes.get('/', asyncErrorHandler(postController.home))

postRoutes.get('/create',  requireLogin, postController.renderCreatePost)

postRoutes.get('/:id', asyncErrorHandler(postController.renderPost))

postRoutes.get('/:id/edit', requireLogin, isPostAuthor, postController.renderEdit)

postRoutes.put('/:id/edit', requireLogin, isPostAuthor, asyncErrorHandler(postController.editPost))

postRoutes.post('/create', requireLogin, asyncErrorHandler(postController.createPost))

postRoutes.delete('/:id/delete', requireLogin, isPostAuthor, postController.deletePost)

export default postRoutes;