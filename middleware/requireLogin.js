
const requireLogin = (req, res, next) => {
    console.log("REQ User: ", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please log in first!');
        return res.redirect('/users/login');
    }
    next();
}

export default requireLogin;