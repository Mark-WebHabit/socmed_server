import { Request, Response, NextFunction } from "express";
import { signForAnHour, verifyJWT } from "../utilities/tokens.js";
import { decodeJWT } from "../utilities/tokens.js";
import { isEmptyObject } from "../utilities/validations.js";
import { IDecode } from "../interfaces/IDecode.js";
import User from "../models/User.js";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req?.cookies) {
    res.status(403).json({ message: "Forbidden: no authorization" });
    return;
  }

  const token = req.cookies?.accessToken;

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
      const data = decodeJWT(token)?.payload as IDecode;

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

      const refreshToken = user?.refreshToken;

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
