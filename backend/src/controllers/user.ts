import { User } from "../models/user.model";
import { decodedToken } from "../types";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import geminiResponse from "../utils/gemini";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while creating user");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((item) => item?.trim() === "")) {
    throw new Error("All fields are required");
  }

  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    return res.status(400).json({
      message: "user already exists",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    return res.status(500).json({
      message: "Failed to create user",
    });
  }

  return res.status(201).json({
    createdUser,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const passValid = await user.isPasswordCorrect(password);
  if (!passValid) {
    return res.status(401).json({
      message: "Password is incorrect",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id.toString()
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "User logged in successfully",
    });
});

const logout = asyncHandler(async (req, res) => {
  // clear cookie and token
  await User.findByIdAndUpdate(
    (req as any).user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httponly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({
      message: "User logged out successfully",
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {
    const matchedToken = process.env.REFRESH_TOKEN_SECRET;
    if (!matchedToken) {
      return res.status(401).json({
        message: "Server Configuration Error : JWT Secret Not Found",
      });
    }

    const decodedToken = jwt.verify(
      incomingToken,
      matchedToken
    ) as decodedToken;

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (incomingToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Refresh Token is Expired",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const newToken = await generateAccessAndRefreshToken(user._id.toString());

    return res
      .status(200)
      .cookie("accessToken", newToken.accessToken, options)
      .cookie("refreshToken", newToken.refreshToken, options)
      .json({
        message: "Access token refreshed successfully",
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: (req as any).user,
    msg: "User fetched successfully",
  });
});

const askAssistant = asyncHandler(async (req, res) => {
  try {
    const { prompt } = req.body || req.params;
    const user = await User.findById((req as any).user._id);
    if (!user) {
      throw new Error("User not found");
    }
    const userName = user.fullName;
    const assistantName = user.assistantName;
    const result = await geminiResponse({ prompt, assistantName, userName });

    const jsonMatch = result?.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({
        message: "Invalid response format",
      });
    }
    const finalResult = JSON.parse(jsonMatch[0]);

    const { type } = finalResult;
    switch (type) {
      case "get_date":
        return res.status(200).json({
          type,
          userInput: finalResult.userInput,
          res: `Current date is ${new Date().toLocaleDateString()}`,
        });
      case "get_time":
        return res.status(200).json({
          type,
          userInput: finalResult.userInput,
          res: `Current time is ${new Date().toLocaleTimeString()}`,
        });
      case "get_day":
        return res.status(200).json({
          type,
          userInput: finalResult.userInput,
          res: `Today is ${new Date().toLocaleDateString(undefined, {
            weekday: "long",
          })}`,
        });
      case "get_month":
        return res.status(200).json({
          type,
          userInput: finalResult.userInput,
          res: `Current month is ${new Date().toLocaleString(undefined, {
            month: "long",
          })}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "general":
      case "calculator_open":
        return res.status(200).json({
          type,
          userInput: finalResult.userInput,
          res: finalResult.response,
        });
      default:
        return res.status(400).json({
          res: "Sorry I did not understand that.",
        });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Ask assistant error",
    });
  }
});

export {
  generateAccessAndRefreshToken,
  registerUser,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  askAssistant,
};
