import { Router } from "express";
import { login, logout, registerUser } from "../controllers/user";
import verifyToken from "../middlewares/auth";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser)
userRouter.route("/login").post(login)

// secured routes as it should be protected.
userRouter.route("/logout").post(verifyToken, logout)

export default userRouter