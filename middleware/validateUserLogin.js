import joi from "joi";

const validateUserLogin = (req, res, next) => {

    const formData = req.body;
    const loginUserSchema = joi.object({
        username: joi.string().required().min(3).max(20),
        password: joi.string().min(8).max(20),
    })
    const { error } = loginUserSchema.validate(formData);
    if (error) {
        req.flash('error', "Invalid format of username or password")
        res.redirect('login');
    }else {
        next();
    }
}

export default validateUserLogin;