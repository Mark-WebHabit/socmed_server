import { Schema, Types, model } from "mongoose";
import { ILike } from "../interfaces/ILike.js";

const likeSchema = new Schema(
  {
    postId: {
      type: Types.ObjectId,
      ref: "Post",
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    isLiked: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

const Like = model<ILike>("Like", likeSchema);

export default Like;
