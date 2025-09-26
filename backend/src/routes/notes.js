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
