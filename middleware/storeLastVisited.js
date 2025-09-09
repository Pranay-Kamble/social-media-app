const storeLastVisited = (req, res, next) => {
    if (req.session.returnTo) {
        console.log("from last visited", req.session.returnTo);
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

export default storeLastVisited;