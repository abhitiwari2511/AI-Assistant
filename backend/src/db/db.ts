import mongoose from "mongoose";

const DB_Name = "aidb"
const connectDB = async () => {
    try {
        const connectionDB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log(`DB connected successfully !! DB host: ${connectionDB.connection.host}`);
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}

export default connectDB