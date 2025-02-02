import { Router } from "express";
import { createPost, getAllPost } from "../controllers/Post.js";
const app = Router();
app.post("/create", createPost).get("/", getAllPost);
export default app;
