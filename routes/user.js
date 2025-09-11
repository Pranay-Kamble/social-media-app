import express from 'express'
import methodOverride from 'method-override'
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import requireLogin from "../middleware/requireLogin.js";
import validateUserEdit from "../middleware/validateUserEdit.js";
import passport from 'passport'
import validateNewUser from "../middleware/validateNewUser.js";
import storeLastVisited from "../middleware/storeLastVisited.js";
import isCorrectUser from "../middleware/isCorrectUser.js";
import userController from '../controllers/user.js'

const userRoutes = express.Router();
userRoutes.use(methodOverride('_method'));


userRoutes.get('/', asyncErrorHandler(userController.home))

userRoutes.get('/signup',userController.renderSignUp)

userRoutes.get('/login',userController.renderLogin)

userRoutes.get('/logout', requireLogin, userController.renderLogout)

userRoutes.get('/:id', asyncErrorHandler(userController.renderUser))

userRoutes.get('/:id/edit', requireLogin, isCorrectUser, asyncErrorHandler(userController.renderUserEdit))

userRoutes.put('/:id', requireLogin, isCorrectUser, validateUserEdit, asyncErrorHandler(userController.edit))

userRoutes.post('/login', storeLastVisited, passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), asyncErrorHandler(userController.login));

userRoutes.post('/logout', requireLogin, userController.logout)

userRoutes.post('/signup', validateNewUser, asyncErrorHandler(userController.signup))

userRoutes.delete('/:id', requireLogin, isCorrectUser, asyncErrorHandler(userController.deleteUser))

export default userRoutes;