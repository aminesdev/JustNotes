import {
    setupUserEncryption,
    getUserEncryptionKeys,
    updateUserEncryptionKeys,
} from "../userService.js";

export async function setupEncryptionService(userId, keyData) {
    const { publicKey, encryptedPrivateKey } = keyData;

    await setupUserEncryption(userId, publicKey, encryptedPrivateKey);

    return {
        success: true,
        message: "Encryption keys stored successfully",
    };
}

export async function getEncryptionKeysService(userId) {
    const keys = await getUserEncryptionKeys(userId);

    return {
        success: true,
        data: keys,
    };
}

export async function updateEncryptionKeysService(userId, keyData) {
    const { publicKey, encryptedPrivateKey } = keyData;

    await updateUserEncryptionKeys(userId, publicKey, encryptedPrivateKey);

    return {
        success: true,
        message: "Encryption keys updated successfully",
    };
}
