import joi from "joi";
import User from "../models/user.js";

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
        req.flash('error', error);
        return res.redirect('users/signup', {user: formData});
    }

    const userSearch = await User.findOne({ email: formData.email });

    if (userSearch != null && (userSearch.email === formData.email)) {
        req.flash('error', 'Email already exists!');
        return res.render('users/signup.ejs', {user: formData});
    }

    if (formData.password !== formData.confirmpassword) {
        req.flash('error', 'Passwords do not match!');
        return res.render('users/signup.ejs', {user: formData});
    }
    next();
}

export default validateNewUser;