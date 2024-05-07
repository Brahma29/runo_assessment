import User from "../models/User.js";
import { tokenGenerator } from "../utils/tokenGenerator.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  try {
    const isUserExists = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    if (isUserExists)
      return res.status(400).json({
        success: false,
        message: "Phone number is already registered!",
      });

    const newUser = await User.create(req.body);

    const token = tokenGenerator({ user: newUser._id });

    return res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });

    const token = tokenGenerator({ user: user._id });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
