import { Router } from "express";
import { createPost, getAllPost, deletePost, editPost, } from "../controllers/Post.js";
const app = Router();
app
    .post("/create", createPost)
    .get("/", getAllPost)
    .get("/del/:id", deletePost)
    .post("/edit/:id", editPost);
export default app;
