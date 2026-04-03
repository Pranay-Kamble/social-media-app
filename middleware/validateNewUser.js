import joi from 'joi';
import User from '../models/user.js';

const validateNewUser = async (req, res, next) => {
    const userSchema = joi.object({
        email: joi.string().email().required().label('Email'),
        display_name: joi.string().required().label('Display Name'),
        username: joi.string().required().min(3).max(20).label('Username'),
        bio: joi.string().optional().allow('').label('Bio'),
        registeredOn: joi.date().iso(),
        password: joi.string().min(8).max(20).required().label('Password'),
        confirmpassword: joi.string().min(8).max(20).required().label('Confirm Password')
    });

    const formData = req.body;
    const { error } = userSchema.validate(formData, { abortEarly: false });
    
    let errors = {};

    if (error) {
        error.details.forEach(err => {
            errors[err.path[0]] = err.message.replace(/['"]/g, ''); 
        });
    }

    const [emailSearch, usernameSearch] = await Promise.all([
        User.findOne({ email: formData.email }),
        User.findOne({ username: formData.username })
    ]);

    if (emailSearch) {
        errors.email = 'Email is already registered!';
    }

    if (usernameSearch) {
        errors.username = 'Username is already taken!';
    }

    if (formData.password !== formData.confirmpassword) {
        errors.confirmpassword = 'Passwords do not match!';
    }
    if (Object.keys(errors).length > 0) {
        return res.render('users/signup.ejs', { user: formData, errors });
    }
    next();
}

export default validateNewUser;