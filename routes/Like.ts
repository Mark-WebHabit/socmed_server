import { Router } from "express";
import { like } from "../controllers/Like.js";
import { getPostParams } from "../middlewares/Params.js";
const app = Router();

app.post("/:postId", getPostParams, like);

export default app;
