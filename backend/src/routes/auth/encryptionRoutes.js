import express from "express";
import {
    setupEncryptionHandler,
    getEncryptionKeysHandler,
    updateEncryptionKeysHandler,
} from "../../controllers/auth/encryptionController.js";
import { validateEncryptionSetup } from "../../middlewares/validation.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/auth/encryption/setup:
 *   post:
 *     summary: Setup encryption keys for E2EE
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - encryptedPrivateKey
 *             properties:
 *               publicKey:
 *                 type: string
 *                 description: User's public key (PEM format)
 *               encryptedPrivateKey:
 *                 type: string
 *                 description: Private key encrypted with password-derived key
 *     responses:
 *       200:
 *         description: Encryption keys stored successfully
 */
router.post("/setup", validateEncryptionSetup, setupEncryptionHandler);

/**
 * @swagger
 * /api/auth/encryption/keys:
 *   get:
 *     summary: Get user's encryption keys
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Encryption keys retrieved successfully
 */
router.get("/keys", getEncryptionKeysHandler);

/**
 * @swagger
 * /api/auth/encryption/update:
 *   put:
 *     summary: Update encryption keys (e.g., after password change)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - encryptedPrivateKey
 *             properties:
 *               publicKey:
 *                 type: string
 *               encryptedPrivateKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Encryption keys updated successfully
 */
router.put("/update", validateEncryptionSetup, updateEncryptionKeysHandler);

export default router;
