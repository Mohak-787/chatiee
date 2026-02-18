import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import "dotenv/config";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided", success: false });

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) return res.status(401).json({ message: "Unauthorized - Invalid token", success: false });

    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    req.user = user;
    next();

  } catch (error) {
    console.error("Error verifying jwt: ", error);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}