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
