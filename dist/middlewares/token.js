import { signForAnHour, verifyJWT } from "../utilities/tokens.js";
import { decodeJWT } from "../utilities/tokens.js";
import { isEmptyObject } from "../utilities/validations.js";
import User from "../models/User.js";
export const verifyToken = async (req, res, next) => {
    var _a;
    if (!(req === null || req === void 0 ? void 0 : req.cookies)) {
        res.status(403).json({ message: "Forbidden: no authorization" });
        return;
    }
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res
            .status(403)
            .json({ message: "Forbidden: no token found in the request" });
        return;
    }
    verifyJWT(token)
        .then((data) => {
        next();
        return;
    })
        .catch(async (error) => {
        var _a;
        const data = (_a = decodeJWT(token)) === null || _a === void 0 ? void 0 : _a.payload;
        if (!data || isEmptyObject(data)) {
            res
                .status(401)
                .json({ message: "No payload found in the token", error });
            return;
        }
        const userId = data.userId;
        const user = await User.findById(userId);
        if (!user) {
            res
                .status(403)
                .json({ message: "Forbidden payload. no user matched", error });
            return;
        }
        const refreshToken = user === null || user === void 0 ? void 0 : user.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token found", error });
            return;
        }
        verifyJWT(refreshToken)
            .then(() => {
            signForAnHour({
                userId,
            })
                .then((newToken) => {
                res.cookie("accessToken", newToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 60 * 60 * 1000,
                    sameSite: "strict",
                });
                next();
                return;
            })
                .catch((error) => {
                res.status(401).json({
                    message: "Cannot grant new access token. something went wrong",
                    error,
                });
                return;
            });
            return;
        })
            .catch((error) => {
            res.status(401).json({
                message: "Cannot renew access token. Refresh token expired",
                error,
            });
            return;
        });
    });
};
// plug/insert the user id to the request
export const requestUserId = async (req, res, next) => {
    var _a;
    const token = req.cookies.accessToken;
    const decoded = decodeJWT(token);
    req.user = (_a = decoded === null || decoded === void 0 ? void 0 : decoded.payload) === null || _a === void 0 ? void 0 : _a.userId;
    next();
};
