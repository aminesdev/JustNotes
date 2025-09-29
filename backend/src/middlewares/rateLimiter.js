import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "../config/redis.js";

export const apiLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(100, "15 m"),
    analytics: true,
});

export const authLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "15 m"), 
    analytics: true,
});
