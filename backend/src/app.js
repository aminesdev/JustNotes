import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";
import cors from "cors";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Authorization"],
    })
);

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Note App API Documentation",
    })
);

app.use("/api", routes);

app.use(errorHandler);

export default app;
