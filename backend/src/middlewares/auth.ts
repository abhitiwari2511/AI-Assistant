import { User } from "../models/user.model";
import { decodedToken } from "../types";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Request",
      });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server configuration error: JWT_SECRET not found",
      });
    }
    const decodedToken = jwt.verify(token, jwtSecret) as decodedToken;

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid User",
      });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default verifyToken