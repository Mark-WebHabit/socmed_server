import { Router } from "express";
import { createPost, getAllPost, deletePost } from "../controllers/Post.js";
const app = Router();
app
    .post("/create", createPost)
    .get("/", getAllPost)
    .get("/del/:id", deletePost);
export default app;
