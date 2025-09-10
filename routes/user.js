import express from 'express'
import User from '../models/user.js'
import methodOverride from 'method-override'
import AppError from "../utils/AppError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import requireLogin from "../middleware/requireLogin.js";
import validateUserEdit from "../middleware/validateUserEdit.js";
import passport from 'passport'
import validateNewUser from "../middleware/validateNewUser.js";
import storeLastVisited from "../middleware/storeLastVisited.js";
import isCorrectUser from "../middleware/isCorrectUser.js";

const userRoutes = express.Router();
userRoutes.use(methodOverride('_method'));


userRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const userData = await User.find({});
    res.render('newWeb/users/user-home.ejs', {userData})
}))

userRoutes.get('/secret', requireLogin, (req, res) => {
    res.send("hello my authenticated dev")
})

userRoutes.get('/signup',(req, res) => {
    res.render('newWeb/users/signup.ejs' , {user:{}})
})

userRoutes.get('/login',(req, res) => {
    res.render('newWeb/users/login.ejs',{user:{}});
})

userRoutes.get('/logout', requireLogin ,(req, res) => {
    res.render('newWeb/users/logout.ejs');
})

userRoutes.get('/:id', asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const userData = await User.findOne({_id: id});

    if (userData === null)
        throw new AppError('User does not exist', 404);
    else
        res.render('newWeb/users/user-profile.ejs', {userData});
}))

userRoutes.get('/:id/edit', requireLogin, isCorrectUser, asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const userData = await User.findOne({_id: id})

    if (userData === null)
        throw new AppError('User does not exist', 404);
    else
        res.render('newWeb/users/edit-user.ejs', {userData})
}))

userRoutes.put('/:id', requireLogin, isCorrectUser, validateUserEdit, asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const newUserData = req.body;
    await User.updateOne({_id: id}, {$set: {username: newUserData.username, email: newUserData.email, bio: newUserData.bio}});
    req.flash('success', 'User profile updated successfully')
    res.redirect('/users/'+id);
}))

userRoutes.post('/login', storeLastVisited, passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), asyncErrorHandler(async (req, res) => {
    const formData = req.body;
    const foundUser = await User.findOne( {username: formData.username}, { _id: 1 , lastLogin: 1} );
    console.log("go to: ", res.locals.returnTo);
    if (foundUser) {
        foundUser.lastLogin = Date.now();
        await foundUser.save();
        req.flash('success', 'Login Successful');
        const redirectLink = res.locals.returnTo || '/posts';
        console.log("Redirect Link: ", redirectLink);
        res.redirect(redirectLink || '/posts');
    }else {
        req.flash('error', 'Invalid username or password');
        res.render('newWeb/users/login.ejs', {user: formData});
    }
}))

userRoutes.post('/logout', requireLogin, (req,res, next) => {
    req.logout(function(err)  {
        if (err) return next(err);
    });
    req.flash('success', 'Logout Successful');
    res.redirect('/users/login')
})

userRoutes.post('/signup', validateNewUser, asyncErrorHandler(async (req, res, next) => { //TODO: Proper Validation of email, hashing of password using bcrypt

    const formData = req.body;
    try {
        const { password } = formData;

        delete formData.password;
        delete formData.confirmpassword;

        const newUser = new User({...formData});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, function(err) {
            if (err) return next(err);
            req.flash('success', 'Created new user and logged in successfully');
            res.redirect(`/users/${newUser._id}`);
        });
    }catch(err) {
        req.flash('error', err.message);
        res.render('newWeb/users/signup.ejs', {user: formData});
    }
}))

userRoutes.delete('/:id', requireLogin, isCorrectUser, asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    req.flash('success', 'Deleted user!')
    res.redirect('/users/');
}))

export default userRoutes;