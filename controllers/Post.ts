import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IPost } from "../interfaces/IPost.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { isValidObjectId } from "../utilities/validations.js";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, body, author }: IPost = req.body;

  if (!body) {
    res.status(400).json({ message: "Missing post body" });
    return;
  }
  if (!author) {
    res.status(400).json({ message: "Author not defined" });
    return;
  }

  if (!isValidObjectId(author)) {
    res.status(400).json({ message: "Author unknown" });
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

export const getAllPost = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "ID not found" });
  }

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  const post = await Post.findByIdAndDelete(id);

  res.status(200).json(post);
});
