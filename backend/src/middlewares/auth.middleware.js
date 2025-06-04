import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Unauthorized request. No token provided.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid Access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Access token has expired. Please log in again.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid access token.",
      });
    } else {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Could not verify access token.",
      });
    }
  }
});
