import express from "express";
import routes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";

const app = express();

app.use(express.json());

// Swagger Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Note App API Documentation",
    })
);

app.use("/api", apiLimiter, routes);
app.use(errorHandler);

export default app;
