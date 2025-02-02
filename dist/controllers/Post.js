import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
export const createPost = asyncHandler(async (req, res) => {
    const { title, body, author } = req.body;
    if (!body) {
        res.status(400).json({ message: "Missing post body" });
        return;
    }
    if (!author) {
        res.status(400).json({ message: "Author not defined" });
        return;
    }
    const user = await User.findById(author);
    if (!user) {
        res.status(400).json({ message: "Author unknown" });
        return;
    }
    let newPost = new Post({
        title,
        body,
        author,
    });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
});
export const getAllPost = asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.status(200).json(posts);
});
