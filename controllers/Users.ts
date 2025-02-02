import { Request, Response } from "express";
import { IUser } from "../interfaces/IUser.js";
import User from "../models/User.js";
import { isValidObjectId } from "../utilities/validations.js";

export const GetAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const findUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  if (!id) {
    res.status(400).json({ message: "ID missing" });
    return;
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error finding user", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "ID not found" });
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(200).json({ message: "No Content" });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(id);

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: "Error deleting user", error });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { firstName, lastName, middleName, birthDate }: IUser = req.body;

  if (!id) {
    res.status(400).json({ message: "No ID provided" });
    return;
  }

  if (!firstName || !lastName || !birthDate) {
    res.status(400).json({ message: "Missing important information" });
    return;
  }

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "No user found" });
    return;
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.middleName = middleName ?? null;
    user.birthDate = birthDate;

    // Calling save to trigger pre-save middleware
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};
