import { Router } from "express";
import {
  GetAllUsers,
  findUser,
  deleteUser,
  updateUser,
} from "../controllers/Users.js";

const app = Router();

app
  .get("/", GetAllUsers)
  .get("/:id", findUser)
  .get("/del/:id", deleteUser)
  .post("/edit/:id", updateUser);

export default app;
