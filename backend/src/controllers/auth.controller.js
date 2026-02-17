import { User } from "../models/user.model.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import "dotenv/config";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
      return res.status(400).json({
        message: "Invalid user data",
        success: false
      });
    }

    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    const user = savedUser.toObject();
    delete user.password;

    res.status(201).json({
      message: "User created successfully",
      data: user,
      success: true
    });

    try {
      await sendWelcomeEmail(user.email, user.fullName, process.env.CLIENT_URL);
    } catch (error) {
      console.error("Error sending welcome email: ", error)
    }

  } catch (error) {
    console.error("Error creating new user: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials", success: false });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials", success: false });

    generateToken(user._id, res);

    const loggedUser = user.toObject();
    delete loggedUser.password;

    res.status(200).json({
      message: "Login successful",
      data: loggedUser,
      success: true
    });

  } catch (error) {
    console.error("Error logging user: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully", success: true })
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture) return res.status(400).json({ message: "Profile picture is required", success: false });

    const userId = res.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(userId, 
      { profilePicture: uploadResponse.secure_url }, 
      { new: true }).select("-password");

    res.status(200).json({
      message: "Updated user successfully",
      data: updatedUser,
      success: true
    });

  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}