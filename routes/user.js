import express from 'express'
import User from '../models/user.js'
import methodOverride from 'method-override'
import AppError from "../utils/AppError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import joi from 'joi'
import bcrypt from 'bcrypt'

const userRoutes = express.Router();
userRoutes.use(methodOverride('_method'));

const validateUserEdit = async (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        bio: joi.string(),
        password: joi.string().min(8).max(20)
    })
    const formData = req.body;

    const { error } = userSchema.validate(formData)

    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        throw new AppError(msg, 404)
    }else {
        next()
    }
}

const validateNewUser = async (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        userid: joi.string().required().min(3).max(20),
        bio: joi.string().optional().allow(''),
        registeredOn: joi.date().iso(),
        password: joi.string().min(8).max(20),
        confirmpassword: joi.string().min(8).max(20)
    })
    const formData = req.body;
    const { error } = userSchema.validate(formData)

    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        throw new AppError(msg, 404)
    }else {
        next()
    }
}

const hashPassword = async (plainText) =>  {
    return await bcrypt.hash(plainText, 12);
}

userRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const userData = await User.find({});
    res.render('newWeb/users/userHome.ejs', {userData})
}))

userRoutes.get('/signup',(req, res) => {
    res.render('newWeb/users/signup.ejs' , {obj:{}})
})

userRoutes.get('/signin',(req, res) => {
    res.render('newWeb/users/signin.ejs')
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
    const formData = req.body;
    const id = req.params.id;
    const newUserData = formData;
    await User.updateOne({_id: id}, {$set: {username: newUserData.username, email: newUserData.email, bio: newUserData.bio}});
    req.flash('success', 'User profile updated successfully')
    res.redirect('/users/'+id);
}))

userRoutes.post('/signup', validateNewUser, asyncErrorHandler(async (req, res) => { //TODO: Proper Validation of email, hashing of password using bcrypt

    const formData = req.body;
    const userSearch = await User.findOne({
        $or: [
            {email: formData.email},
            {userid: formData.userid}
        ]
    });

    //**************** Move these check to client side somehow **********************
    if (userSearch) {
        if (userSearch.email) {
            req.flash('error', 'Email already exists!');
            res.render('newWeb/users/signup.ejs', {obj: formData});
            return;
        }
        if (userSearch.userid) {
            req.flash('error', 'UserID already in use!');
            res.render('newWeb/users/signup.ejs', {obj: formData});
            return;
        }
        if (formData.password !== formData.confirmpassword) {
            req.flash('error', 'Passwords do not match!');
            res.render('newWeb/users/signup.ejs', {obj: formData});
            return;
        }
    }
    //*************** Move these check to client side somehow **********************

    formData.password = await hashPassword(formData.password);

    const newUser = new User({...formData});
    await newUser.save();
    console.log(newUser);
    req.flash('success', 'Created new user');
    res.redirect(`/users/${newUser._id}`);
}))

userRoutes.delete('/:id', asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    req.flash('success', 'Deleted user!')
    res.redirect('/users/');

    //also implement mongo middleware to also delete all the comments that the user has made or keep the comments but make their username as deleted

}))

export default userRoutes;