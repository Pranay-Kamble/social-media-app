import User from '../models/user.js';
import AppError from "../utils/AppError.js";


const home =async (req, res) => {
    const userData = await User.find({});
    res.render('users/user-home.ejs', {userData})
}

const renderSignUp = (req, res) => {
    res.render('users/signup.ejs' , {user:{}})
}

const renderLogin = (req, res) => {
    res.render('users/login.ejs',{user:{}});
}

const renderLogout = (req, res) => {
    res.render('users/logout.ejs');
}

const renderUser = async (req, res) => {
    const {id} = req.params;
    const userData = await User.findOne({_id: id});
    console.log(id);
    console.log(userData);
    if (userData === null)
        throw new AppError('User does not exist', 404);
    else
        res.render('users/user-profile.ejs', {userData});
}

const renderUserEdit = async (req, res) => {
    const id = req.params.id;
    const userData = await User.findOne({_id: id})

    if (userData === null)
        throw new AppError('User does not exist', 404);
    else
        res.render('users/edit-user.ejs', {userData})
}

const edit = async (req, res) => {
    const id = req.params.id;
    const newUserData = req.body;
    await User.updateOne({_id: id}, {$set: {username: newUserData.username, email: newUserData.email, bio: newUserData.bio}});
    req.flash('success', 'User profile updated successfully')
    res.redirect('/users/'+id);
}

const login = async (req, res) => {
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
        res.render('users/login.ejs', {user: formData});
    }
}

const logout = (req,res, next) => {
    req.logout(function(err)  {
        if (err) return next(err);
    });
    req.flash('success', 'Logout Successful');
    res.redirect('/users/login')
}

const signup = async (req, res, next) => {

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
        res.render('users/signup.ejs', {user: formData});
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    await User.deleteOne({_id: id});
    req.flash('success', 'Deleted user!')
    res.redirect('/users/');
}

export default {deleteUser, signup, login, logout, home, renderLogin, renderUser, renderLogout, renderUserEdit, renderSignUp, edit};