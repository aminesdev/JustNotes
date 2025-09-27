import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Too many requests, try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
