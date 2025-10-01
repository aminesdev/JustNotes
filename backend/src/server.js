import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/database.js";
import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();

// Safe route debugging function
function debugRoutes() {
    console.log("\n--- Testing Routes ---");
    console.log("Registered routes in app:");

    try {
        // Check if _router exists and has stack
        if (app._router && app._router.stack) {
            app._router.stack.forEach((middleware) => {
                if (middleware.route) {
                    // This is a direct route
                    const method =
                        Object.keys(
                            middleware.route.methods
                        )[0]?.toUpperCase() || "UNKNOWN";
                    console.log(`${method} ${middleware.route.path}`);
                } else if (
                    middleware.name === "router" &&
                    middleware.handle &&
                    middleware.handle.stack
                ) {
                    // This is router middleware
                    console.log(`Router mounted`);
                    middleware.handle.stack.forEach((handler) => {
                        if (handler.route) {
                            const method =
                                Object.keys(
                                    handler.route.methods
                                )[0]?.toUpperCase() || "UNKNOWN";
                            console.log(`  ${method} ${handler.route.path}`);
                        }
                    });
                }
            });
        } else {
            console.log("No routes found or _router not available");
        }
    } catch (error) {
        console.log("Error debugging routes:", error.message);
    }
}

async function startServer() {
    try {
        await connectDb();

        const emailReady = await verifyEmailConnection();
        if (!emailReady) {
            console.warn(
                "Email service is not available. Email-related features will not work."
            );
        }

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(
                `API Documentation available at: http://localhost:${PORT}/api-docs`
            );
            console.log(
                `Email service: ${emailReady ? "Ready" : "Not available"}`
            );

            // Call safe route debugging
            debugRoutes();
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
