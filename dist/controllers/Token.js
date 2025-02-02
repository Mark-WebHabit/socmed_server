import asyncHandler from "express-async-handler";
import { verifyJWT } from "../utilities/tokens.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) {
        res.status(400).json({ message: "Token not found" });
        return;
    }
    try {
        const data = (await verifyJWT(token));
        const id = data.userId;
        const user = await User.findByIdAndUpdate(id, {
            verified: true,
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        //   for development onnly, on production just send the response data
        res.status(200).redirect(`${process.env.BASE_URL}/`);
    }
    catch (error) {
        res.status(401).json({ message: "Invalid Token", error: error });
    }
});
