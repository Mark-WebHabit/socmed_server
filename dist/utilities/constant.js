var _a;
import dotenv from "dotenv";
dotenv.config();
export const secret_key = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "defaultsecret";
export const BASE_URL = process.env.BASE_URL;
export const APP_EMAIL = process.env.APP_EMAIL;
export const APP_PASS = process.env.APP_PASS;
export const PORT = process.env.PORT || 8081;
export const URI = process.env.MONGO_URI;
