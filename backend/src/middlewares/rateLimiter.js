import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";

export const apiLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Too many requests, try again later.",
    },
    standardHeaders: true, 
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        msg: "Too many authentication attempts, please try again later.",
    },
    skipSuccessfulRequests: true,
});
