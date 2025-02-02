import { Router } from "express";
import { Register, Login, Logout, changePass } from "../controllers/Auth.js";

const app = Router();

app
  .post("/register", Register)
  .post("/login", Login)
  .post("/logout", Logout)
  .post("/cpass/:id", changePass);

export default app;
