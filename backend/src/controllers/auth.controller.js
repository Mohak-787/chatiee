import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    if (!newUser) {
      return res.send(400).json({
        message: "Invalid user data",
        success: false
      });
    }

    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
      success: true
    });

  } catch (error) {
    console.error("Error creating new user: ", error);
    res.send(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

export const login = async (req, res) => {
  res.send('Hello signup')
}

export const logout = async (req, res) => {
  res.send('Hello signup')
}