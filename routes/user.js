import express from 'express'
import User from '../models/user.js'
import methodOverride from 'method-override'
import AppError from "../utils/AppError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import bcrypt from 'bcrypt'
import requireLogin from "../middleware/requireLogin.js";
import validateUserEdit from "../middleware/validateUserEdit.js";
import validateUserLogin from "../middleware/validateUserLogin.js";
import validateNewUser from "../middleware/validateNewUser.js";

const userRoutes = express.Router();
userRoutes.use(methodOverride('_method'));

const hashPassword = async (plainText) =>  {
    return await bcrypt.hash(plainText, 12);
}

userRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const userData = await User.find({});
    res.render('newWeb/users/userHome.ejs', {userData})
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
        res.render('newWeb/users/userProfile.ejs', {userData});
}))

userRoutes.get('/:id/edit', asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const userData = await User.findOne({_id: id})

    if (userData === null)
        throw new AppError('User does not exist', 404);
    else
        res.render('newWeb/users/editUser.ejs', {userData})
}))

userRoutes.put('/:id', validateUserEdit, asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const newUserData = req.body;
    await User.updateOne({_id: id}, {$set: {username: newUserData.username, email: newUserData.email, bio: newUserData.bio}});
    req.flash('success', 'User profile updated successfully')
    res.redirect('/users/'+id);
}))

userRoutes.post("/login", validateUserLogin, asyncErrorHandler(async (req, res) => {
    const formData = req.body;
    console.log(formData);
    const dbData = await User.findOne({userid: formData.username});

    if (dbData === null) {
        req.flash('error', 'Incorrect username or password');
        res.render('newWeb/users/login.ejs', {user: formData});
        return;
    }
    const hash = await bcrypt.compare(req.body.password, dbData.password);
    if (hash) {
        dbData.lastLogin = Date.now();
        await dbData.save();
        req.session.user_id = dbData._id;
        req.flash("Login Successful");
        res.redirect('/posts');
    }else {
        req.flash('error', 'Invalid username or password');
        res.render('newWeb/users/login.ejs', {user: formData});
    }
}))

userRoutes.post('/logout', requireLogin, (req,res) => {
    req.session.destroy();
    res.redirect('/users/login')
})


userRoutes.post('/signup', validateNewUser, asyncErrorHandler(async (req, res) => { //TODO: Proper Validation of email, hashing of password using bcrypt
    const formData = req.body;
    formData.password = await hashPassword(formData.password);
    const newUser = new User({...formData});

    await newUser.save();
    req.flash('success', 'Created new user');
    res.redirect(`/users/${newUser._id}`);
}))

userRoutes.delete('/:id', asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    req.flash('success', 'Deleted user!')
    res.redirect('/users/');
}))

export default userRoutes;