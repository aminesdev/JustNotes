# Project: src

## File: app.js
```js
import express from "express";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());

app.use("/api", routes);

export default app;

```

## File: config/database.js
```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

## File: controllers/authController.js
```js
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/generateToken.js";
import {
    addRefreshToken,
    removeRefreshToken,
    isValidRefreshToken,
} from "../services/refreshTokenService.js";
import {
    createUser,
    findUserByUsername,
    verifyUserCredentials,
    findUserById,
} from "../services/userService.js";

export async function register(req, res) {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ msg: "Please provide all fields" });
        }
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = await createUser(username, password, role);
        const accessToken = generateAccessToken({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
        });
        const refreshToken = generateRefreshToken({
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
        });
        await addRefreshToken(refreshToken, newUser.id);
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await verifyUserCredentials(username, password);
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const accessToken = generateAccessToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
            username: user.username,
            role: user.role,
        });
        await addRefreshToken(refreshToken, user.id);
        res.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Refresh token required" });
        }
        const isValid = await isValidRefreshToken(refreshToken);
        if (!isValid) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }
        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(403).json({ msg: "User not found" });
        }
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
        };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);
        await removeRefreshToken(refreshToken);
        await addRefreshToken(newRefreshToken, user.id);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await removeRefreshToken(refreshToken);
        }
        res.json({ msg: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
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
        req.user = verifyAccessToken(token);
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

## File: routes/auth.js
```js
import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;

```

## File: routes/index.js
```js
import express from "express";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

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

const router = express.Router();

router.use(authenticate);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

```

## File: server.js
```js
import app from "./app.js";
import dotenv from "dotenv";
import { connectDb } from "./config/database.js";

dotenv.config();
connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

```

## File: services/noteService.js
```js
import prisma from "../config/database.js";

export const createNote = async (userId, data) => {
    const { title, content, category, tags, isPinned } = data;

    return await prisma.note.create({
        data: {
            title,
            content,
            category: category || "general",
            tags: tags || [],
            isPinned: isPinned || false,
            userId,
        },
    });
};

export const getNotes = async (userId) => {
    return await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const getNoteById = async (userId, noteId) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
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

export async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
    });
}

export async function createUser(username, password, role) {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role: role.toUpperCase(), 
        },
    });
}

export async function verifyUserCredentials(username, password) {
    const user = await findUserByUsername(username);
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

```

## File: utils/generateToken.js
```js
import jwt from "jsonwebtoken";

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

