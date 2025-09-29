import express from "express";
import helmet from "helmet";
import routes from "./routes/index.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { specs, swaggerUi } from "./config/swagger.js";
import { withRateLimit } from "./middlewares/withRateLimit.js";

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    })
);

app.use(express.json({ limit: "10mb" }));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Note App API Documentation",
    })
);

app.use("/api", withRateLimit(apiLimiter), routes);
app.use("/api/auth", withRateLimit(authLimiter));
app.use(errorHandler);

export default app;
