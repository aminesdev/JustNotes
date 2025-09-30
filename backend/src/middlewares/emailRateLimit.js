import { Ratelimit } from "@upstash/ratelimit";
import redisClient from "../config/redis.js";

export const emailRateLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
});

export async function checkEmailRateLimit(identifier) {
    const { success, reset } = await emailRateLimiter.limit(identifier);
    if (!success) {
        throw new Error(
            `Email rate limit exceeded. Try again at ${new Date(reset)}`
        );
    }
}
