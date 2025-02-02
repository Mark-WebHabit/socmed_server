import User from "../models/User.js";
import { sendEmail } from "../utilities/sendEmail.js";
import { decodeJWT, signForADay, signForAnHour } from "../utilities/tokens.js";
import bcrypt from "bcrypt";
import { isEmptyObject } from "../utilities/validations.js";
import { isValidObjectId } from "../utilities/validations.js";
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Missing Credentials" });
        return;
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).json({ message: "Wrong email or password" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Wrong email or password" });
            return;
        }
        if (!user.verified) {
            res.status(401).json({ message: "Email not verified" });
            return;
        }
        const refreshToken = await signForADay({
            userId: user._id,
        });
        const accessToken = await signForAnHour({
            userId: user._id,
        });
        const updated = await User.findOneAndUpdate(user._id, {
            refreshToken: refreshToken,
        });
        res
            .status(200)
            .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
        })
            .json({
            updated,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
};
export const Register = async (req, res) => {
    const { firstName, lastName, middleName, age, birthDate, email, password, } = req.body;
    if (!firstName || !lastName || !birthDate || !email || !password) {
        res.status(400).json({ message: "Some required fields are missing" });
        return;
    }
    if (!emailRegex.test(email)) {
        res.status(400).json({
            message: "Invalid Email Format",
        });
        return;
    }
    if (!passwordRegex.test(password)) {
        res.status(400).json({
            message: "Password must be at least 8 characters long and contain at least one letter and one number.",
        });
        return;
    }
    const userDuplicate = await User.findOne({ email });
    if (userDuplicate) {
        res.status(400).json({ message: "Email already taken" });
        return;
    }
    try {
        // Create a new user
        let newUser = new User({
            firstName,
            lastName,
            middleName,
            age,
            birthDate,
            email,
            password,
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        signForAnHour({
            userId: savedUser._id,
        })
            .then(async (data) => {
            await sendEmail(email, data);
            // Return the created user
            res.status(201).json(savedUser);
        })
            .catch((error) => {
            res.status(500).json({ message: "Error creating user", error });
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};
export const Logout = async (req, res) => {
    var _a;
    const header = req === null || req === void 0 ? void 0 : req.cookies;
    let token = null;
    if (header) {
        token = header === null || header === void 0 ? void 0 : header.accessToken;
    }
    if (token) {
        const payload = (_a = decodeJWT(token)) === null || _a === void 0 ? void 0 : _a.payload;
        if (!isEmptyObject(payload)) {
            await User.findOneAndUpdate({ _id: payload === null || payload === void 0 ? void 0 : payload.userId }, {
                refreshToken: null,
            });
        }
    }
    res
        .clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
    })
        .json({ message: "Logout success" });
};
export const changePass = async (req, res) => {
    const { id } = req.params;
    const { newPass, oldPass } = req.body;
    if (!id) {
        res.status(400).json({ message: "No ID provided" });
        return;
    }
    if (!newPass || !oldPass) {
        res
            .status(400)
            .json({ message: "New passoword and old password required" });
        return;
    }
    if (!isValidObjectId(id)) {
        res.status(400).json({ message: "No user found" });
        return;
    }
    try {
        const user = await User.findById(id).select("+password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Current Password doesnt macthed" });
            return;
        }
        if (!passwordRegex.test(newPass)) {
            res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one letter and one number.",
            });
            return;
        }
        user.password = newPass;
        await user.save();
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error changing password", error });
    }
};
