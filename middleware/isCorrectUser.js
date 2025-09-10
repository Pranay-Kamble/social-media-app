import User from '../models/user.js';

const isCorrectUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id, {_id:1});
    if (!(req.user._id.equals(user._id))) {
        req.flash('error', 'You don\'t have permission to do this');
        return res.redirect(`/users/${id}`);
    }

    next();
}

export default isCorrectUser;