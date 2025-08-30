import express from 'express'
import User from '../models/user.js'
import methodOverride from 'method-override'
import AppError from "../utils/AppError.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js"
import joi from 'joi'


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

userRoutes.get('/', asyncErrorHandler(async (req, res) => {
    const userData = await User.find({});
    res.render('newWeb/users/userHome.ejs', {userData})
}))

userRoutes.get('/signup',(req, res) => {
    res.render('newWeb/users/signup.ejs')
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
    res.redirect('/users/'+id);
}))

userRoutes.post('/signup', validateNewUser, asyncErrorHandler(async (req, res) => { //TODO: Proper Validation of email, hashing of password using bcrypt

    const formData = req.body;
    const userSearch = await User.findOne({
        $or: [
            {email: formData.email},
            {userid: formData.userid}
        ]
    })

    if (userSearch && userSearch.email) {
        console.log("Email already exists");
        throw new AppError('Email already used', 400);
    }
    if (userSearch && userSearch.userid) {
        console.log("UserID already exists");
        throw new AppError('UserID already exists', 400);
    }
    if (formData.password !== formData.confirmpassword) {
        throw new AppError('Passwords do not match', 400);
    }

    const newUser = new User({...formData});
    await newUser.save();
    console.log(newUser);
    res.redirect(`/users/${newUser._id}`);
}))

userRoutes.delete('/:id', asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    res.redirect('/users/');

    //also implement mongo middleware to also delete all the comments that the user has made

}))

export default userRoutes;