import { Router } from "express";
import { like, getPostLike } from "../controllers/Like.js";
import { getPostParams } from "../middlewares/Params.js";
const app = Router();

app
  .post("/:postId", getPostParams, like)
  .get("/:postId", getPostParams, getPostLike);

export default app;
