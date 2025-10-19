import dotenv from "dotenv";
import app from "./app";
import connectDB from "./db/db";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });
