import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ILike } from "../interfaces/ILike.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { isValidObjectId } from "../utilities/validations.js";
import { CustomRequest } from "../interfaces/IRequest.js";
import Like from "../models/Like.js";

export const like = asyncHandler(
  async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req?.user;
    const { postId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    if (!isValidObjectId(userId)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const userWhoLike = await User.findById(userId);

    if (!userWhoLike) {
      res.status(401).json({ message: "Unknown user" });
      return;
    }

    const postToLike = await Post.findById(postId);

    if (!postToLike) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const like = await Like.findOne({
      userId,
      postId: postToLike._id,
    });

    if (like) {
      const isLiked = like.isLiked;

      const updated = await Like.findByIdAndUpdate(
        like._id,
        {
          isLiked: !isLiked,
        },
        { new: true }
      );

      res.status(200).json({ isLiked: updated?.isLiked });
      return;
    } else {
      const newLike = new Like({
        userId: userWhoLike._id,
        postId: postToLike._id,
        isLiked: true,
      });

      await newLike.save();

      res.status(200).send({ isLiked: newLike.isLiked });
      return;
    }
  }
);

export const getPostLike = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  const likes = await Like.find({
    postId,
    isLiked: true,
  });

  if (!likes || likes?.length == 0) {
    res.status(200).json([]);
  } else {
    res.status(200).json(likes);
  }
});
