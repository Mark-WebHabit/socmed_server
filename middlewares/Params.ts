import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { isValidObjectId } from "mongoose";

export const getPostParams = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json({ message: "Post ID not found" });
      return;
    }

    if (!isValidObjectId(postId)) {
      res.status(400).json({ message: "Invalid Post ID format" });
      return;
    }

    next();
  }
);

export const getUserParams = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID not found" });
      return;
    }

    if (!isValidObjectId(userId)) {
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    next();
  }
);
