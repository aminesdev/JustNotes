import express from "express";
import routes from "./routes/index.js";
import {apiLimiter} from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api", apiLimiter, routes);
app.use(errorHandler);
export default app;
