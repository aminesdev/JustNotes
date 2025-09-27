import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Note-Taking API",
            version: "1.0.0",
            description:
                "A comprehensive note-taking application API with user authentication and categorization",
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
                            description: "Category name",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            description: "Category description",
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
                            description: "Note title",
                        },
                        content: {
                            type: "string",
                            description: "Note content",
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
                            description: "Note tags",
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
    apis: ["./src/routes/*.js"], // Path to the API files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
