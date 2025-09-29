import express from "express";
import authRoutes from "./authRoutes.js";
import emailVerificationRoutes from "./emailVerificationRoutes.js";
import passwordResetRoutes from "./passwordResetRoutes.js";
import encryptionRoutes from "./encryptionRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/email", emailVerificationRoutes);
router.use("/password", passwordResetRoutes);
router.use("/encryption", encryptionRoutes);

export default router;
