import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    middleName: { type: String, default: null },
    age: { type: Number },
    birthDate: { required: true, type: String },
    email: {
        required: true,
        type: String,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid Email Address",
        },
    },
    password: {
        required: true,
        type: String,
        select: false,
        validate: {
            validator: (value) => {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(value);
            },
            message: "Password must be at least 8 characters long and contain at least one letter and one number.",
        },
    },
    verified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    // Calculate age based on birthdate
    if (this.isModified("birthDate")) {
        const birthDate = new Date(this.birthDate);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs); // milliseconds from epoch
        this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidate) {
    return await bcrypt.compare(candidate, this.password);
};
const User = model("User", userSchema);
export default User;
