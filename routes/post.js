import express from "express"
import methodOverride from "method-override";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import requireLogin from "../middleware/requireLogin.js";
import isPostAuthor from "../middleware/isPostAuthor.js"
import postController from "../controllers/post.js"
import multer from "multer";
import { storage } from "../cloudinary/index.js"

const upload = multer({storage});

const postRoutes = express.Router();
postRoutes.use(methodOverride('_method'));

postRoutes.get('/', asyncErrorHandler(postController.home))

postRoutes.get('/create',  requireLogin, postController.renderCreatePost)

postRoutes.get('/:id', asyncErrorHandler(postController.renderPost))

postRoutes.get('/:id/edit', requireLogin, isPostAuthor, postController.renderEdit)

// postRoutes.put('/:id/edit', requireLogin, isPostAuthor, asyncErrorHandler(postController.editPost))
postRoutes.put('/:id/edit', requireLogin, isPostAuthor, upload.array('image'), asyncErrorHandler(postController.editPost))

// postRoutes.post('/create', requireLogin, asyncErrorHandler(postController.createPost))
postRoutes.post('/create', requireLogin, upload.array('image'), asyncErrorHandler(postController.createPost));

postRoutes.delete('/:id/delete', requireLogin, isPostAuthor, postController.deletePost)

export default postRoutes;