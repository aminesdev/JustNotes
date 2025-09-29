import {
    setupEncryptionService,
    getEncryptionKeysService,
    updateEncryptionKeysService,
} from "../../services/auth/encryptionService.js";

export async function setupEncryptionHandler(req, res) {
    try {
        const result = await setupEncryptionService(req.user.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to store encryption keys",
            error: error.message,
        });
    }
}

export async function getEncryptionKeysHandler(req, res) {
    try {
        const result = await getEncryptionKeysService(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to retrieve encryption keys",
            error: error.message,
        });
    }
}

export async function updateEncryptionKeysHandler(req, res) {
    try {
        const result = await updateEncryptionKeysService(req.user.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to update encryption keys",
            error: error.message,
        });
    }
}
