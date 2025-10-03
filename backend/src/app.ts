import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
};
console.log(corsOptions.origin);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes importing
import userRouter from "./routes/user.route";
// routes declare
app.use("/api/v1/users", userRouter);

export default app;
