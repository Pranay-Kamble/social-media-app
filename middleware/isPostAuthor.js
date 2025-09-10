import Post from "../models/post.js";

const isPostAuthor = async (req, res, next) => {

    const { id } = req.params;
    const post = await Post.findById(id, {creatorId:1, _id:0});
    console.log("req user id: ", req.user._id , "-- id: ", post.creatorId);
    console.log(post)
    if (!(req.user._id.equals(post.creatorId))) {
        req.flash('error', 'You don\'t have permission to perform this action');
        return res.redirect(`/posts/${id}`);
    }

    next();
}

export default isPostAuthor;