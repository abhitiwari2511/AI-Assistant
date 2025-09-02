import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserType, UserMethods } from "../types";

type UserModel = Model<UserType, {}, UserMethods>;

const userSchema = new Schema<UserType, UserModel, UserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    assistantName: {
      type: String
    },
    assistantImage: {
      type: String
    },
    refreshToken: {
        type: String
    },
    history: [{ type: String }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    jwtSecret,
    {
      expiresIn: "1d"
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshToken) {
    throw new Error("Refresh Token is not defined")
  }
  return jwt.sign({
    _id: this._id
  }, refreshToken, {
    expiresIn: "10d"
  })
};

export const User = mongoose.model<UserType, UserModel>("User", userSchema);
