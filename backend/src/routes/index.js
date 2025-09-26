import express from "express";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

export default router;