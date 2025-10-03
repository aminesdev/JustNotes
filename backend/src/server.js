import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/database.js";
import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();

async function startServer() {
    try {
        const emailReady = await verifyEmailConnection();
        if (!emailReady) {
            console.warn(
                "Email service is not available. Email-related features will not work."
            );
        }
        await connectDb();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
