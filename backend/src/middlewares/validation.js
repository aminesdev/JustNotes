import { body, param, validationResult } from "express-validator";

// Middleware to handle validation errors
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

// Auth validation rules
export const validateRegister = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "Username can only contain letters, numbers, and underscores"
        ),

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
    body("username").trim().notEmpty().withMessage("Username is required"),

    body("password").notEmpty().withMessage("Password is required"),

    handleValidationErrors,
];

export const validateRefreshToken = [
    body("refreshToken").notEmpty().withMessage("Refresh token is required"),

    handleValidationErrors,
];

// Note validation rules
export const validateCreateNote = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Title is required and must be less than 200 characters"),

    body("content")
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage(
            "Content is required and must be less than 10,000 characters"
        ),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category must be less than 50 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
        .optional()
        .trim()
        .isLength({ max: 30 })
        .withMessage("Each tag must be less than 30 characters"),

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
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters"),

    body("content")
        .optional()
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage("Content must be between 1 and 10,000 characters"),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category must be less than 50 characters"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
        .optional()
        .trim()
        .isLength({ max: 30 })
        .withMessage("Each tag must be less than 30 characters"),

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
