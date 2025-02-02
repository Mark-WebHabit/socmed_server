import { Router } from "express";
import { verifyToken } from "../controllers/Token.js";

const app = Router();

app.get("/:token", verifyToken);

export default app;
