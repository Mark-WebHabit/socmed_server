import mongoose, { ObjectId, Schema } from "mongoose";

export interface IPost {
  title: string;
  body: string;
  author: mongoose.mongo.BSON.ObjectId;
}
