const storeLastVisited = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        console.log(res.locals.returnTo);
    }
    next();
}

export default storeLastVisited;