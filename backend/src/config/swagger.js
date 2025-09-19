import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Note App API",
            version: "1.0.0",
            description:
                "A complete note management API with JWT authentication, user management, and note CRUD operations",
            contact: {
                name: "Note App Support",
                email: "support@noteapp.com",
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Development server",
            },
            {
                url: "https://api.noteapp.com/api",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        "Enter JWT token in the format: Bearer <token>",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["username", "role"],
                    properties: {
                        id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                            description: "Unique user identifier",
                        },
                        username: {
                            type: "string",
                            example: "john_doe",
                            description: "Unique username for authentication",
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "user"],
                            example: "user",
                            description: "User role determining access level",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-01T00:00:00.000Z",
                            description: "User creation timestamp",
                        },
                    },
                },
                Note: {
                    type: "object",
                    required: ["title", "content"],
                    properties: {
                        id: {
                            type: "string",
                            example: "507f1f77bcf86cd799439012",
                            description: "Unique note identifier",
                        },
                        title: {
                            type: "string",
                            example: "Meeting Notes",
                            description: "Title of the note",
                        },
                        content: {
                            type: "string",
                            example:
                                "Discussed project timelines and deliverables...",
                            description: "Content of the note",
                        },
                        category: {
                            type: "string",
                            example: "work",
                            description: "Note category for organization",
                        },
                        isPinned: {
                            type: "boolean",
                            example: false,
                            description:
                                "Whether the note is pinned for quick access",
                        },
                        tags: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            example: ["meeting", "important"],
                            description: "Tags for categorizing notes",
                        },
                        userId: {
                            type: "string",
                            example: "507f1f77bcf86cd799439011",
                            description: "ID of the user who created the note",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-01T00:00:00.000Z",
                            description: "Note creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2024-01-01T00:00:00.000Z",
                            description: "Note last update timestamp",
                        },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/components/schemas/User",
                        },
                        accessToken: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            description:
                                "JWT access token for API authentication",
                        },
                        refreshToken: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            description:
                                "JWT refresh token for obtaining new access tokens",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                            description:
                                "Indicates if the request was successful",
                        },
                        msg: {
                            type: "string",
                            example: "Invalid credentials",
                            description: "Human-readable error message",
                        },
                        code: {
                            type: "string",
                            example: "AUTH_ERROR",
                            description: "Machine-readable error code",
                        },
                        details: {
                            type: "object",
                            example: { field: "password" },
                            description: "Additional error details",
                        },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                            description:
                                "Indicates if the request was successful",
                        },
                        message: {
                            type: "string",
                            example: "Operation completed successfully",
                            description: "Success message",
                        },
                        data: {
                            type: "object",
                            description: "Response data payload",
                        },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Access token is missing or invalid",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                success: false,
                                msg: "Access token required",
                                code: "UNAUTHORIZED",
                            },
                        },
                    },
                },
                ForbiddenError: {
                    description:
                        "User doesn't have permission to access this resource",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                success: false,
                                msg: "Insufficient permissions",
                                code: "FORBIDDEN",
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Request validation failed",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Error",
                            },
                            example: {
                                success: false,
                                msg: "Validation failed",
                                code: "VALIDATION_ERROR",
                                details: {
                                    username: "Username is required",
                                },
                            },
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: "Authentication",
                description: "User registration, login, and token management",
            },
            {
                name: "Users",
                description: "User management operations",
            },
            {
                name: "Notes",
                description: "Note CRUD operations and management",
            },
            {
                name: "Admin",
                description: "Administrative operations (admin users only)",
            },
        ],
        externalDocs: {
            description: "Find out more about Note App",
            url: "https://github.com/your-username/note-app",
        },
    },
    apis: ["./src/routes/*.js"],
};

export default swaggerJsdoc(options);
