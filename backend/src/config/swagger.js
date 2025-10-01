import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E2EE Note-Taking API",
            version: "1.0.0",
            description: `
# End-to-End Encrypted Note-Taking API

## Important Security Notice

This API is designed for **end-to-end encryption**. All sensitive data must be encrypted **client-side** before being sent to the server.

## Client Responsibilities:

1. **Generate Encryption Keys**: Each user must generate their own RSA key pair
2. **Encrypt Data Client-Side**: All note content, titles, and metadata must be encrypted before sending to the API
3. **Manage Keys Securely**: Private keys are encrypted with the user's password and never sent to the server in plaintext

## Data Format Requirements:

- **title**: Base64 encoded encrypted string
- **content**: Base64 encoded encrypted string  
- **tags**: Array of base64 encoded encrypted strings
- **encryptedKey**: Symmetric key encrypted with user's public key (base64)
- **category name/description**: Base64 encoded encrypted strings

## Encryption Flow:

1. Client generates random symmetric key for each note
2. Client encrypts note data with symmetric key
3. Client encrypts symmetric key with user's public key
4. Client sends encrypted data + encrypted key to server
5. Server stores only encrypted data

## Decryption Flow:

1. Client retrieves encrypted data from server
2. Client decrypts symmetric key with their private key
3. Client decrypts note data with symmetric key

## Validation:

The API validates that all sensitive data is properly base64 encoded. Unencrypted plain text will be rejected.
            `.trim(),
            contact: {
                name: "API Support",
                email: "support@noteapp.com",
            },
        },
        servers: [
            {
                url: process.env.APP_URL || "http://localhost:3001",
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
                    required: ["name"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Category unique identifier",
                        },
                        name: {
                            type: "string",
                            format: "base64",
                            description:
                                "**ENCRYPTED** - Category name (base64 encoded encrypted data)",
                            example: "RW5jcnlwdGVkQ2F0ZWdvcnlOYW1l",
                        },
                        description: {
                            type: "string",
                            format: "base64",
                            nullable: true,
                            description:
                                "**ENCRYPTED** - Category description (base64 encoded encrypted data)",
                            example: "RW5jcnlwdGVkRGVzY3JpcHRpb24=",
                        },
                        color: {
                            type: "string",
                            default: "#6B73FF",
                            description:
                                "Category color in hex format (not encrypted)",
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
                    required: ["title", "content"],
                    properties: {
                        id: {
                            type: "string",
                            description: "Note unique identifier",
                        },
                        title: {
                            type: "string",
                            format: "base64",
                            description:
                                "**ENCRYPTED** - Note title (base64 encoded encrypted data)",
                            example: "VGhpcyBpcyBhbiBlbmNyeXB0ZWQgdGl0bGU=",
                        },
                        content: {
                            type: "string",
                            format: "base64",
                            description:
                                "**ENCRYPTED** - Note content (base64 encoded encrypted data)",
                            example: "VGhpcyBpcyBlbmNyeXB0ZWQgbm90ZSBjb250ZW50",
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
                                format: "base64",
                                description:
                                    "**ENCRYPTED** - Individual tag (base64 encoded encrypted data)",
                            },
                            description:
                                "**ENCRYPTED** - Note tags (array of base64 encoded encrypted strings)",
                            example: [
                                "RW5jcnlwdGVkVGFnMQ==",
                                "RW5jcnlwdGVkVGFnMg==",
                            ],
                        },
                        encryptedKey: {
                            type: "string",
                            format: "base64",
                            nullable: true,
                            description:
                                "Symmetric key encrypted with user's public key (base64)",
                            example: "RW5jcnlwdGVkU3ltbWV0cmljS2V5",
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
    apis: [
        "./src/routes/*.js", // Top-level route files
        "./src/routes/**/*.js", // All subdirectory route files
        "./src/routes/auth/*.js", // Specific auth routes
        "./src/routes/auth/**/*.js", // Auth subdirectory routes
    ],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
