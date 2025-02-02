import jwt from "jsonwebtoken";
import { secret_key } from "./constant.js";

export const signForAnHour = async (payload: Object) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret_key, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const signForADay = async (payload: Object) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret_key, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verifyJWT = async (token: string) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    })
  );
};

export const decodeJWT = (token: string) => {
  return jwt.decode(token, { complete: true });
};
