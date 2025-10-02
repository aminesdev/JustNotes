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

// Note validation helpers
export const validateNoteData = (fieldName, maxLength = 100000) => [
    body(fieldName)
        .isLength({ min: 1, max: maxLength })
        .withMessage(`${fieldName} is required`)
        .isString()
        .withMessage(`${fieldName} must be a string`),
];

export const validateTags = [
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
            if (tags && tags.length > 0) {
                for (const tag of tags) {
                    if (typeof tag !== "string") {
                        throw new Error("Each tag must be a string");
                    }
                }
            }
            return true;
        }),
];

// Category validation helpers
export const validateCategoryData = [
    body("name")
        .isLength({ min: 1, max: 255 })
        .withMessage(
            "Category name is required and must be less than 255 characters"
        )
        .isString()
        .withMessage("Category name must be a string"),

    body("description")
        .optional({ nullable: true, checkFalsy: true }) // Allow null, undefined, or empty string
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
];

// Auth validations
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

// Note validations
export const validateCreateNote = [
    ...validateNoteData("title", 255),
    ...validateNoteData("content", 100000),
    ...validateTags,

    body("categoryId")
        .optional({ nullable: true, checkFalsy: true })
        .custom((value) => {
            // Allow null, undefined, empty string, or valid string
            if (value === null || value === undefined || value === "") {
                return true;
            }
            return typeof value === "string";
        })
        .withMessage("Category ID must be a string"),

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
        .isString()
        .isLength({ max: 255 })
        .withMessage("Title must be a string and less than 255 characters"),

    body("content")
        .optional()
        .isString()
        .isLength({ max: 100000 })
        .withMessage(
            "Content must be a string and less than 100000 characters"
        ),

    ...validateTags,

    body("categoryId")
        .optional({ nullable: true, checkFalsy: true })
        .custom((value) => {
            // Allow null, undefined, empty string, or valid string
            if (value === null || value === undefined || value === "") {
                return true;
            }
            return typeof value === "string";
        })
        .withMessage("Category ID must be a string"),

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

// Email validations
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

// Category validations
export const validateCategory = [
    ...validateCategoryData,

    body("color")
        .optional()
        .isHexColor()
        .withMessage("Color must be a valid hex color"),

    handleValidationErrors,
];

export const validateCategoryUpdate = [
    param("id").isLength({ min: 1 }).withMessage("Category ID is required"),

    body("name")
        .optional()
        .isString()
        .isLength({ max: 255 })
        .withMessage(
            "Category name must be a string and less than 255 characters"
        ),

    body("description")
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage("Description must be a string")
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),

    body("color")
        .optional()
        .isHexColor()
        .withMessage("Color must be a valid hex color"),

    handleValidationErrors,
];