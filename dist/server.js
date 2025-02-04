import express from "express";
import { fileURLToPath } from "url";
import { errorLogger } from "./middlewares/errorlog.js";
import { connect } from "mongoose";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
// utilities
import { writeServerError } from "./utilities/fs.js";
// routers
import userRoutes from "./routes/Users.js";
import tokenRoutes from "./routes/Token.js";
import authRoutes from "./routes/Auth.js";
import postRoutes from "./routes/Post.js";
import likeRoutes from "./routes/Like.js";
// custom middleware
import { verifyToken } from "./middlewares/token.js";
import { requestUserId } from "./middlewares/token.js";
// constant
import { URI } from "./utilities/constant.js";
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8081;
app.use(cookieParser());
// parse json requestes
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// routes
app.use("/auth", authRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/post", verifyToken, postRoutes);
app.use("/likes", verifyToken, requestUserId, likeRoutes);
app.use("/verify", tokenRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "authenticated.html"));
});
app.use((err, req, res, next) => {
    errorLogger(err, req, res, next);
});
app.listen(PORT, async () => {
    try {
        if (URI) {
            await connect(URI);
            console.log(`Server Listening on http://localhost:${PORT}`);
        }
    }
    catch (error) {
        console.error("Server Error:", error); // Enhanced error logging to console
        await writeServerError(error);
    }
});
