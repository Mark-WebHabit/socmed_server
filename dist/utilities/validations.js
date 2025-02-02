import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
export function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
};
