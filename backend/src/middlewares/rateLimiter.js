import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: "Too many requests, try again later." },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
});
