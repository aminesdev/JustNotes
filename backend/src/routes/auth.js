import express from "express";
import authRouter from "./auth/index.js";

const router = express.Router();

router.use("/", authRouter);

export default router;
