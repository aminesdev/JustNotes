import mongoose from "mongoose";

export default async function connectDb() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.log("Database connection error", err.message);
        process.exit(1);
    }
}
