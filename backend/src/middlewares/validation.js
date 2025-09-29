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
