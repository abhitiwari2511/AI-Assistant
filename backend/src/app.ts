import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config({
  path: "./.env",
});

app.set("trust proxy", 1);

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};

app.use(
  cors(corsOptions)
);
app.options('*', cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes importing
import userRouter from "./routes/user.route";
// routes declare
app.use("/api/v1/users", userRouter);

export default app;
