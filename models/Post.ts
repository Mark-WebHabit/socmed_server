import { Schema, Types, model } from "mongoose";
import { IPost } from "../interfaces/IPost.js";

const postSchema = new Schema(
  {
    title: { type: String, default: "" },
    body: { type: String, required: true },
    author: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
