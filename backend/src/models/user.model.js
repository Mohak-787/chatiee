import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: "",
    trim: true
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);