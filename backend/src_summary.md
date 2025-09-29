# Project: src

## File: app.js
```js
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

```

## File: config/database.js
```js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;

export async function connectDb() {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected via Prisma");
    } catch (err) {
        console.log("Database connection error", err.message);
        process.exit(1);
    }
}

```

## File: config/redis.js
```js
// src/config/redis.js
import { Redis } from "@upstash/redis";

const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default redisClient;

```

## File: config/swagger.js
```js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E2EE Note-Taking API",
            version: "1.0.0",
            description:
                "An end-to-end encrypted note-taking application API. All note content is encrypted on the client side before being sent to the server.",
            contact: {
                name: "API Support",
                email: "support@noteapp.com",
            },
        },
        servers: [
            {
                url: process.env.APP_URL || "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your access token",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "User unique identifier",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                        },
                        role: {
                            type: "string",
                            enum: ["USER", "ADMIN"],
                            description: "User role",
                        },
                        isVerified: {
                            type: "boolean",
                            description: "Email verification status",
                        },
                        publicKey: {
                            type: "string",
                            nullable: true,
                            description: "User's public key for E2EE",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Account creation timestamp",
                        },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Category unique identifier",
                        },
                        name: {
                            type: "string",
                            description: "Category name (encrypted)",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            description: "Category description (encrypted)",
                        },
                        color: {
                            type: "string",
                            default: "#6B73FF",
                            description: "Category color in hex format",
                        },
                        userId: {
                            type: "string",
                            description: "Owner user ID",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Note: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Note unique identifier",
                        },
                        title: {
                            type: "string",
                            description: "Note title (encrypted base64)",
                        },
                        content: {
                            type: "string",
                            description: "Note content (encrypted base64)",
                        },
                        categoryId: {
                            type: "string",
                            nullable: true,
                            description: "Associated category ID",
                        },
                        category: {
                            $ref: "#/components/schemas/Category",
                            nullable: true,
                        },
                        isPinned: {
                            type: "boolean",
                            default: false,
                            description: "Whether the note is pinned",
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            description: "Note tags (encrypted)",
                        },
                        encryptedKey: {
                            type: "string",
                            nullable: true,
                            description:
                                "Symmetric key encrypted with user's public key",
                        },
                        userId: {
                            type: "string",
                            description: "Owner user ID",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            description: "Operation success status",
                        },
                        message: {
                            type: "string",
                            description: "Response message",
                        },
                        data: {
                            type: "object",
                            description: "Response data",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        msg: {
                            type: "string",
                            description: "Error message",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                            },
                            description: "Validation errors",
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

```

## File: controllers/auth/authController.js
```js
import {
    registerService,
    loginService,
    refreshTokenService,
    logoutService,
} from "../../services/auth/authService.js";

export async function register(req, res) {
    try {
        const result = await registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const result = await loginService(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            return res.status(400).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Please verify your email before logging in") {
            return res.status(403).json({
                success: false,
                msg: error.message,
                code: "EMAIL_NOT_VERIFIED",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const result = await refreshTokenService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        if (
            error.message === "Refresh token required" ||
            error.message === "Invalid refresh token" ||
            error.message === "User not found or not verified"
        ) {
            return res.status(403).json({
                success: false,
                msg: error.message,
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    try {
        const result = await logoutService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

```

## File: controllers/auth/emailVerificationController.js
```js
import {
    verifyEmailService,
    resendVerificationService,
} from "../../services/auth/emailVerificationService.js";

export async function verifyEmailHandler(req, res) {
    try {
        const result = await verifyEmailService(req.body.code);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function resendVerificationHandler(req, res) {
    try {
        const result = await resendVerificationService(req.body.email);
        res.json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Email is already verified") {
            return res.status(400).json({
                success: false,
                msg: error.message,
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

```

## File: controllers/auth/encryptionController.js
```js
import {
    setupEncryptionService,
    getEncryptionKeysService,
    updateEncryptionKeysService,
} from "../../services/auth/encryptionService.js";

export async function setupEncryptionHandler(req, res) {
    try {
        const result = await setupEncryptionService(req.user.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to store encryption keys",
            error: error.message,
        });
    }
}

export async function getEncryptionKeysHandler(req, res) {
    try {
        const result = await getEncryptionKeysService(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to retrieve encryption keys",
            error: error.message,
        });
    }
}

export async function updateEncryptionKeysHandler(req, res) {
    try {
        const result = await updateEncryptionKeysService(req.user.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to update encryption keys",
            error: error.message,
        });
    }
}

```

## File: controllers/auth/passwordResetController.js
```js
import {
    forgotPasswordService,
    resetPasswordService,
} from "../../services/auth/passwordResetService.js";

export async function forgotPasswordHandler(req, res) {
    try {
        const result = await forgotPasswordService(req.body.email);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function resetPasswordHandler(req, res) {
    try {
        const result = await resetPasswordService(
            req.body.code,
            req.body.newPassword
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

```

## File: controllers/noteController.js
```js
import * as noteService from "../services/noteService.js";

export const createNote = async (req, res) => {
    try {
        const note = await noteService.createNote(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await noteService.getNotes(req.user.id);
        res.json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const note = await noteService.getNoteById(req.user.id, req.params.id);
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const updateNote = async (req, res) => {
    try {
        const note = await noteService.updateNote(
            req.user.id,
            req.params.id,
            req.body
        );
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const note = await noteService.deleteNote(req.user.id, req.params.id);
        if (!note) {
            return res
                .status(404)
                .json({ success: false, msg: "Note not found" });
        }
        res.json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

```

## File: middlewares/authMiddleware.js
```js
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

```

## File: middlewares/errorHandler.js
```js
export function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            msg: "Validation Error",
            errors: err.errors,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            msg: "Record not found",
        });
    }

    res.status(500).json({
        success: false,
        msg: "Internal server error",
    });
}

```

## File: middlewares/rateLimiter.js
```js
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

```

## File: middlewares/validation.js
```js
import { body, param, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            msg: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

export const validateRegister = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    body("role")
        .optional()
        .isIn(["USER", "ADMIN"])
        .withMessage("Role must be either USER or ADMIN")
        .toUpperCase(),

    handleValidationErrors,
];

export const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),

    handleValidationErrors,
];

export const validateRefreshToken = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),

    handleValidationErrors,
];

export const validateCreateNote = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Encrypted title is required"),

    body("content")
        .trim()
        .isLength({ min: 1, max: 100000 })
        .withMessage("Encrypted content is required"),

    body("categoryId")
        .optional()
        .isString()
        .withMessage("Category ID must be a string"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("encryptedKey")
        .optional()
        .isString()
        .withMessage("Encrypted key must be a string"),

    body("isPinned")
        .optional()
        .isBoolean()
        .withMessage("isPinned must be a boolean"),

    handleValidationErrors,
];

export const validateUpdateNote = [
    param("id").isLength({ min: 1 }).withMessage("Note ID is required"),

    body("title")
        .optional()
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Encrypted title must be valid"),

    body("content")
        .optional()
        .trim()
        .isLength({ min: 1, max: 100000 })
        .withMessage("Encrypted content must be valid"),

    body("categoryId")
        .optional()
        .isString()
        .withMessage("Category ID must be a string"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("encryptedKey")
        .optional()
        .isString()
        .withMessage("Encrypted key must be a string"),

    body("isPinned")
        .optional()
        .isBoolean()
        .withMessage("isPinned must be a boolean"),

    handleValidationErrors,
];

export const validateNoteId = [
    param("id").isLength({ min: 1 }).withMessage("Note ID is required"),

    handleValidationErrors,
];

export const validateEmail = [
    body("email").isEmail().withMessage("Valid email is required"),
    handleValidationErrors,
];

export const validatePasswordReset = [
    body("code")
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage("Valid 6-digit code is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),

    handleValidationErrors,
];

export const validateVerificationCode = [
    body("code")
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage("Valid 6-digit code is required"),

    handleValidationErrors,
];

export const validateEncryptionSetup = [
    body("publicKey")
        .isString()
        .isLength({ min: 1, max: 10000 })
        .withMessage("Public key is required"),

    body("encryptedPrivateKey")
        .isString()
        .isLength({ min: 1, max: 10000 })
        .withMessage("Encrypted private key is required"),

    handleValidationErrors,
];

```

## File: middlewares/withRateLimit.js
```js
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

```

## File: routes/auth/authRoutes.js
```js
import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../../controllers/auth/authController.js";
import {
    validateRegister,
    validateLogin,
    validateRefreshToken,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: User registered, verification code sent
 */
router.post("/register", validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user (requires verified email)
 *     tags: [Authentication]
 *     security: []
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security: []
 */
router.post("/refresh", validateRefreshToken, refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security: []
 */
router.post("/logout", logout);

export default router;

```

## File: routes/auth/emailVerificationRoutes.js
```js
import express from "express";
import {
    verifyEmailHandler,
    resendVerificationHandler,
} from "../../controllers/auth/emailVerificationController.js";
import {
    validateVerificationCode,
    validateEmail,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/email/verify:
 *   post:
 *     summary: Verify email with 6-digit code
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify", validateVerificationCode, verifyEmailHandler);

/**
 * @swagger
 * /api/auth/email/resend:
 *   post:
 *     summary: Resend verification code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/resend", validateEmail, resendVerificationHandler);

export default router;

```

## File: routes/auth/encryptionRoutes.js
```js
import express from "express";
import {
    setupEncryptionHandler,
    getEncryptionKeysHandler,
    updateEncryptionKeysHandler,
} from "../../controllers/auth/encryptionController.js";
import { validateEncryptionSetup } from "../../middlewares/validation.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/auth/encryption/setup:
 *   post:
 *     summary: Setup encryption keys for E2EE
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - encryptedPrivateKey
 *             properties:
 *               publicKey:
 *                 type: string
 *                 description: User's public key (PEM format)
 *               encryptedPrivateKey:
 *                 type: string
 *                 description: Private key encrypted with password-derived key
 *     responses:
 *       200:
 *         description: Encryption keys stored successfully
 */
router.post("/setup", validateEncryptionSetup, setupEncryptionHandler);

/**
 * @swagger
 * /api/auth/encryption/keys:
 *   get:
 *     summary: Get user's encryption keys
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Encryption keys retrieved successfully
 */
router.get("/keys", getEncryptionKeysHandler);

/**
 * @swagger
 * /api/auth/encryption/update:
 *   put:
 *     summary: Update encryption keys (e.g., after password change)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - encryptedPrivateKey
 *             properties:
 *               publicKey:
 *                 type: string
 *               encryptedPrivateKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Encryption keys updated successfully
 */
router.put("/update", validateEncryptionSetup, updateEncryptionKeysHandler);

export default router;

```

## File: routes/auth/index.js
```js
import express from "express";
import authRoutes from "./authRoutes.js";
import emailVerificationRoutes from "./emailVerificationRoutes.js";
import passwordResetRoutes from "./passwordResetRoutes.js";
import encryptionRoutes from "./encryptionRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/email", emailVerificationRoutes);
router.use("/password", passwordResetRoutes);
router.use("/encryption", encryptionRoutes);

export default router;

```

## File: routes/auth/passwordResetRoutes.js
```js
import express from "express";
import {
    forgotPasswordHandler,
    resetPasswordHandler,
} from "../../controllers/auth/passwordResetController.js";
import {
    validateEmail,
    validatePasswordReset,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/password/forgot:
 *   post:
 *     summary: Request password reset code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/forgot", validateEmail, forgotPasswordHandler);

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     summary: Reset password with 6-digit code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/reset", validatePasswordReset, resetPasswordHandler);

export default router;

```

## File: routes/auth.js
```js
import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

router.use("/", authRouter);

export default router;

```

## File: routes/categories.js
```js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import * as categoryService from "../services/categoryService.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all user categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
    try {
        const categories = await categoryService.getUserCategories(req.user.id);
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Work-related notes and tasks"
 *               color:
 *                 type: string
 *                 default: "#6B73FF"
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res) => {
    try {
        const category = await categoryService.createCategory(
            req.user.id,
            req.body
        );
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Category'
 *                         - type: object
 *                           properties:
 *                             notes:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Work"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated work-related notes"
 *               color:
 *                 type: string
 *                 example: "#33FF57"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.user.id,
            req.params.id,
            req.body
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

/**
 * @swagger
* /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
*/
router.delete("/:id", async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

export default router;
```

## File: routes/docs.js
```js
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: API Documentation
 *     description: Interactive API documentation powered by Swagger UI
 *     tags: [Documentation]
 *     security: []
 *     responses:
 *       200:
 *         description: Swagger UI documentation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

export default router;

```

## File: routes/index.js
```js
import express from "express";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";
import categoryRoutes from "./categories.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Notes
 *     description: Note management endpoints
 *   - name: Categories
 *     description: Category management endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Note API is running"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Note API is running",
        version: "1.0.0",
    });
});

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/categories", categoryRoutes);

export default router;

```

## File: routes/notes.js
```js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} from "../controllers/noteController.js";
import {
    validateCreateNote,
    validateUpdateNote,
    validateNoteId,
} from "../middlewares/validation.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all user notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateNoteId, getNoteById);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "My First Note"
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 example: "This is the content of my note."
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *                 example: "clx123abc456"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 30
 *                 example: ["work", "important"]
 *               isPinned:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", validateCreateNote, createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Updated Note Title"
 *               content:
 *                 type: string
 *                 maxLength: 10000
 *                 example: "Updated note content."
 *               categoryId:
 *                 type: string
 *                 nullable: true
 *                 example: "clx123abc456"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 30
 *                 example: ["updated", "work"]
 *               isPinned:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", validateUpdateNote, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", validateNoteId, deleteNote);

export default router;

```

## File: server.js
```js
import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./config/database.js";
import { verifyEmailConnection } from "./services/emailService.js";

dotenv.config();

async function startServer() {
    try {
        // Connect to database
        await connectDb();

        // Test email connection
        const emailReady = await verifyEmailConnection();
        if (!emailReady) {
            console.warn(
                "Email service is not available. Email-related features will not work."
            );
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(
                `API Documentation available at: http://localhost:${PORT}/api-docs`
            );
            console.log(
                `Email service: ${emailReady ? "Ready" : "Not available"}`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

```

## File: services/auth/authService.js
```js
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../utils/generateToken.js";
import {
    addRefreshToken,
    removeRefreshToken,
    isValidRefreshToken,
} from "../refreshTokenService.js";
import {
    createUser,
    verifyUserCredentials,
    findUserById,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function registerService(userData) {
    const { email, password, role } = userData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = await createUser(email, password, role || "USER");

    try {
        await sendVerificationEmail(email, newUser.verificationCode);
    } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
    }

    return {
        success: true,
        message:
            "User registered successfully. Please check your email for the 6-digit verification code.",
        data: {
            userId: newUser.id,
            email: newUser.email,
        },
    };
}

export async function loginService(credentials) {
    const { email, password } = credentials;
    const user = await verifyUserCredentials(email, password);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    await addRefreshToken(refreshToken, user.id);

    return {
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
            refreshToken,
        },
    };
}

export async function refreshTokenService(refreshToken) {
    if (!refreshToken) {
        throw new Error("Refresh token required");
    }

    const isValid = await isValidRefreshToken(refreshToken);
    if (!isValid) {
        throw new Error("Invalid refresh token");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        throw new Error("Invalid refresh token");
    }

    const user = await findUserById(decoded.id);
    if (!user || !user.isVerified) {
        throw new Error("User not found or not verified");
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await removeRefreshToken(refreshToken);
    await addRefreshToken(newRefreshToken, user.id);

    return {
        success: true,
        message: "Token refreshed successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
    };
}

export async function logoutService(refreshToken) {
    if (refreshToken) {
        await removeRefreshToken(refreshToken);
    }
    return {
        success: true,
        message: "Logged out successfully",
    };
}

```

## File: services/auth/emailVerificationService.js
```js
import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateToken.js";
import { addRefreshToken } from "../refreshTokenService.js";
import {
    verifyUserEmail,
    updateUserVerificationCode,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function verifyEmailService(code) {
    if (!code) {
        throw new Error("Verification code is required");
    }

    const user = await verifyUserEmail(code);

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    await addRefreshToken(refreshToken, user.id);

    return {
        success: true,
        message: "Email verified successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
            refreshToken,
        },
    };
}

export async function resendVerificationService(email) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("Email is already verified");
    }

    const updatedUser = await updateUserVerificationCode(email);
    await sendVerificationEmail(email, updatedUser.verificationCode);

    return {
        success: true,
        message: "Verification code sent successfully",
    };
}

```

## File: services/auth/encryptionService.js
```js
import {
    setupUserEncryption,
    getUserEncryptionKeys,
    updateUserEncryptionKeys,
} from "../userService.js";

export async function setupEncryptionService(userId, keyData) {
    const { publicKey, encryptedPrivateKey } = keyData;

    await setupUserEncryption(userId, publicKey, encryptedPrivateKey);

    return {
        success: true,
        message: "Encryption keys stored successfully",
    };
}

export async function getEncryptionKeysService(userId) {
    const keys = await getUserEncryptionKeys(userId);

    return {
        success: true,
        data: keys,
    };
}

export async function updateEncryptionKeysService(userId, keyData) {
    const { publicKey, encryptedPrivateKey } = keyData;

    await updateUserEncryptionKeys(userId, publicKey, encryptedPrivateKey);

    return {
        success: true,
        message: "Encryption keys updated successfully",
    };
}

```

## File: services/auth/passwordResetService.js
```js
import {
    setPasswordResetCode,
    resetUserPassword,
    findUserByEmail,
} from "../userService.js";
import { sendPasswordResetEmail } from "../emailService.js";

export async function forgotPasswordService(email) {
    const user = await findUserByEmail(email);

    if (user) {
        const updatedUser = await setPasswordResetCode(email);
        await sendPasswordResetEmail(email, updatedUser.verificationCode);
    }

    return {
        success: true,
        message: "If the email exists, a password reset code has been sent",
    };
}

export async function resetPasswordService(code, newPassword) {
    if (!code || !newPassword) {
        throw new Error("Code and new password are required");
    }

    const user = await resetUserPassword(code, newPassword);

    return {
        success: true,
        message: "Password reset successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
}

```

## File: services/categoryService.js
```js
import prisma from "../config/database.js";

export const createCategory = async (userId, data) => {
    const { name, description, color } = data;

    return await prisma.category.create({
        data: {
            name,
            description: description || null,
            color: color || "#6B73FF",
            userId,
        },
    });
};

export const getUserCategories = async (userId) => {
    return await prisma.category.findMany({
        where: { userId },
        orderBy: { name: "asc" },
    });
};

export const getCategoryById = async (userId, categoryId) => {
    return await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            notes: true,
        },
    });
};

export const updateCategory = async (userId, categoryId, updateData) => {
    return await prisma.category.update({
        where: {
            id: categoryId,
            userId,
        },
        data: updateData,
    });
};

export const deleteCategory = async (userId, categoryId) => {
    return await prisma.category.delete({
        where: {
            id: categoryId,
            userId,
        },
    });
};

```

## File: services/emailService.js
```js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
    try {
        console.log("Resend email service configured");
        return true;
    } catch (error) {
        console.error("Resend connection failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
            to: email,
            subject: "Verify Your Email - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p><small>This code will expire in 15 minutes.</small></p>
                    <p><small>If you didn't request this code, please ignore this email.</small></p>
                </div>
            `,
            text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send verification email");
        }

        console.log("Verification email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

export const sendPasswordResetEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
            to: email,
            subject: "Password Reset Request - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p>Your password reset code is:</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #dc3545; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p><small>This code will expire in 15 minutes.</small></p>
                    <p><small>If you didn't request this code, please ignore this email and your password will remain unchanged.</small></p>
                </div>
            `,
            text: `Your password reset code is: ${code}. This code will expire in 15 minutes.`,
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send password reset email");
        }

        console.log("Password reset email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
```

## File: services/noteService.js
```js
import prisma from "../config/database.js";

export const createNote = async (userId, data) => {
    const { title, content, categoryId, tags, isPinned, encryptedKey } = data;

    return await prisma.note.create({
        data: {
            title,
            content,
            categoryId: categoryId || null,
            tags: tags || [],
            isPinned: isPinned || false,
            encryptedKey: encryptedKey || null,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const getNotes = async (userId) => {
    return await prisma.note.findMany({
        where: { userId },
        include: {
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getNoteById = async (userId, noteId) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const updateNote = async (userId, noteId, updateData) => {
    return await prisma.note.update({
        where: {
            id: noteId,
            userId,
        },
        data: updateData,
        include: {
            category: true,
        },
    });
};

export const deleteNote = async (userId, noteId) => {
    return await prisma.note.delete({
        where: {
            id: noteId,
            userId,
        },
    });
};

```

## File: services/refreshTokenService.js
```js
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";

export async function addRefreshToken(token, userId) {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });
}

export async function removeRefreshToken(token) {
    const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token },
    });

    if (tokenRecord) {
        return await prisma.refreshToken.delete({
            where: { id: tokenRecord.id },
        });
    }
    return null;
}

export async function isValidRefreshToken(token) {
    const foundToken = await prisma.refreshToken.findFirst({
        where: { token },
    });
    return !!foundToken;
}

export async function clearUserRefreshTokens(userId) {
    return await prisma.refreshToken.deleteMany({
        where: { userId },
    });
}

```

## File: services/userService.js
```js
import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateVerificationCode } from "../utils/generateToken.js";

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(email, password, role) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            verificationCode,
            verificationCodeExpiry,
            isVerified: false,
        },
    });
}

export async function verifyUserCredentials(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

export async function verifyUserEmail(code) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired verification code");
    }

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

export async function updateUserVerificationCode(email) {
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode,
            verificationCodeExpiry,
        },
    });
}

export async function setPasswordResetCode(email) {
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode: resetCode,
            verificationCodeExpiry: resetCodeExpiry,
        },
    });
}

export async function resetUserPassword(code, newPassword) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired reset code");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

export async function setupUserEncryption(
    userId,
    publicKey,
    encryptedPrivateKey
) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            publicKey,
            encryptedPrivateKey,
        },
    });
}

export async function getUserEncryptionKeys(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            publicKey: true,
            encryptedPrivateKey: true,
        },
    });
}

export async function updateUserEncryptionKeys(
    userId,
    publicKey,
    encryptedPrivateKey
) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            publicKey,
            encryptedPrivateKey,
        },
    });
}

```

## File: utils/generateToken.js
```js
// src/utils/generateToken.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

```

## File: utils/hash.js
```js
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
```

