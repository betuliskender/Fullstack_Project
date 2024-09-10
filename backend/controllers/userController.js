import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not register user", error });
  }
};
