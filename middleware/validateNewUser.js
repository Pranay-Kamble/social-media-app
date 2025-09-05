import joi from "joi";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

const validateNewUser = async (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().email().required(),
        display_name: joi.string().required(),
        username: joi.string().required().min(3).max(20),
        bio: joi.string().optional().allow(''),
        registeredOn: joi.date().iso(),
        password: joi.string().min(8).max(20),
        confirmpassword: joi.string().min(8).max(20)
    })
    const formData = req.body;
    console.log(formData);
    const { error } = userSchema.validate(formData)

    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        throw new AppError(msg, 404)
    }

    const userSearch = await User.findOne({
        $or: [
            {email: formData.email},
            {username: formData.username}
        ]
    });
    console.log("user Search: ");
    console.log(userSearch);

    //**************** Move these checks to client side somehow for real time update**********************
    if (userSearch) {
        if (userSearch.email === formData.email) {
            req.flash('error', 'Email already exists!');
            res.render('newWeb/users/signup.ejs', {user: formData});
            return;
        }
        if (userSearch.username === formData.username) {
            req.flash('error', 'Username already in use!');
            res.render('newWeb/users/signup.ejs', {user: formData});
            return;
        }
    }
    if (formData.password !== formData.confirmpassword) {
        req.flash('error', 'Passwords do not match!');
        res.render('newWeb/users/signup.ejs', {user: formData});
        return;
    }
    //*************** Move these check to client side somehow **********************
    next();
}

export default validateNewUser;