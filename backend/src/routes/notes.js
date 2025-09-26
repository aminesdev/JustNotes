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
router.get("/", getNotes);
router.get("/:id", validateNoteId, getNoteById);
router.post("/", validateCreateNote, createNote);
router.put("/:id", validateUpdateNote, updateNote);
router.delete("/:id", validateNoteId, deleteNote);

export default router;
