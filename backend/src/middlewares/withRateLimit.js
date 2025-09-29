export function withRateLimit(limiter) {
    return async function (req, res, next) {
        const ip = req.ip ?? "127.0.0.1";
        const { success, reset, remaining } = await limiter.limit(ip);

        if (!success) {
            return res.status(429).json({
                success: false,
                msg: "Too many requests, please try again later.",
                reset,
            });
        }

        next();
    };
}
