import mongoose from "mongoose";

export interface ILike {
  userId: mongoose.mongo.BSON.ObjectId;
  postId: mongoose.mongo.BSON.ObjectId;
  isLiked: boolean;
}
