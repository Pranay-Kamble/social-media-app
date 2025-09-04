
const requireLogin = (req, res, next) => {
    console.log(req.session);
    if (!req.session.user_id) {
        res.redirect('/users/login');
    }else {
        next();
    }
}

export default requireLogin;