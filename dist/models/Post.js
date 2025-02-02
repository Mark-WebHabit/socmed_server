import { Schema, model } from "mongoose";
const postSchema = new Schema({
    title: { type: String, default: "" },
    body: { type: String, required: true },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const Post = model("Post", postSchema);
export default Post;
