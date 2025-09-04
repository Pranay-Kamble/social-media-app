import joi from "joi";
import AppError from "../utils/AppError.js";

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

export default validateUserEdit;