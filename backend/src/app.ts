import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// routes importing
import userRouter from "./routes/user.route"
// routes declare
app.use("/api/v1/users", userRouter);

export default app;