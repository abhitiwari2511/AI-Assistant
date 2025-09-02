import { Router } from "express";
import { getCurrentUser, login, logout, registerUser } from "../controllers/user";
import verifyToken from "../middlewares/auth";
import updateAssistant from "../controllers/assitant";
import { upload } from "../middlewares/multer";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser)
userRouter.route("/login").post(login)

// secured routes as it should be protected.
userRouter.route("/logout").post(verifyToken, logout)
userRouter.route("/current-user").get(verifyToken, getCurrentUser)
userRouter.route("/updateAssistant").post(verifyToken,
    upload.single("assistantImage") ,updateAssistant)

export default userRouter