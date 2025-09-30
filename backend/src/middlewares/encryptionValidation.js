import { body } from "express-validator";

export const validateEncryptedData = (fieldName, maxLength = 100000) => [
    body(fieldName)
        .isLength({ min: 1, max: maxLength })
        .withMessage(`${fieldName} is required`)
        .custom((value) => {
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(value) || value.length % 4 !== 0) {
                throw new Error(
                    `${fieldName} must be valid base64 encoded data`
                );
            }
            try {
                const decoded = Buffer.from(value, "base64").toString();
                const printableRatio =
                    decoded.replace(/[^\x20-\x7E]/g, "").length /
                    decoded.length;
                if (printableRatio > 0.9 && decoded.length > 10) {
                    throw new Error(
                        `${fieldName} appears to be unencrypted plain text. All sensitive data must be encrypted client-side before sending to the API.`
                    );
                }
            } catch (e) {

            }

            return true;
        }),
];

export const validateEncryptedTags = [
    body("tags")
        .optional()
        .isArray()
        .withMessage("Tags must be an array")
        .custom((tags) => {
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            for (const tag of tags) {
                if (
                    typeof tag !== "string" ||
                    !base64Regex.test(tag) ||
                    tag.length % 4 !== 0
                ) {
                    throw new Error(
                        "Each tag must be a valid base64 encoded string"
                    );
                }
            }
            return true;
        }),
];

export const validateEncryptedKey = [
    body("encryptedKey")
        .optional()
        .isString()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Encrypted key must be a valid base64 string")
        .custom((value) => {
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(value) || value.length % 4 !== 0) {
                throw new Error(
                    "Encrypted key must be valid base64 encoded data"
                );
            }
            return true;
        }),
];

export const validateEncryptedCategory = [
    body("name")
        .isLength({ min: 1, max: 1000 })
        .withMessage("Category name is required")
        .custom((value) => {
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(value) || value.length % 4 !== 0) {
                throw new Error(
                    "Category name must be valid base64 encoded data"
                );
            }
            return true;
        }),

    body("description")
        .optional()
        .isString()
        .isLength({ max: 5000 })
        .withMessage("Description must be a string")
        .custom((value) => {
            if (value) {
                const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
                if (!base64Regex.test(value) || value.length % 4 !== 0) {
                    throw new Error(
                        "Category description must be valid base64 encoded data"
                    );
                }
            }
            return true;
        }),
];
