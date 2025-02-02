import { JwtPayload } from "jsonwebtoken";
import mongoose, { Types } from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export function isValidObjectId(id: string | Types.ObjectId) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const isEmptyObject = (obj: string | JwtPayload) => {
  return Object.keys(obj).length === 0;
};
