import express from "express";
import routes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();
app.use(express.json());

app.use("/api", apiLimiter, routes);

export default app;
