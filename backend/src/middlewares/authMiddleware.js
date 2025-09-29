import { verifyAccessToken } from "../utils/generateToken.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Invalid token format" });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded.isVerified) {
            return res.status(403).json({
                success: false,
                msg: "Please verify your email before accessing this resource",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                msg: "Access token expired",
                code: "TOKEN_EXPIRED",
            });
        }
        return res.status(403).json({ msg: "Invalid token" });
    }
}

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Forbidden" });
        }
        next();
    };
}
