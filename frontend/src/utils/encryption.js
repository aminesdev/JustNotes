import CryptoJS from "crypto-js";

export class EncryptionService {
    static stringToBase64(str) {
        try {
            if (typeof btoa !== "undefined")
                return btoa(unescape(encodeURIComponent(str)));
            return Buffer.from(str, "utf8").toString("base64");
        } catch (err) {
            console.error("Base64 encoding error:", err);
            throw new Error("Failed to encode data to base64");
        }
    }

    static base64ToString(base64) {
        try {
            if (typeof atob !== "undefined")
                return decodeURIComponent(escape(atob(base64)));
            return Buffer.from(base64, "base64").toString("utf8");
        } catch (err) {
            console.error("Base64 decoding error:", err);
            throw new Error("Failed to decode base64 data");
        }
    }

    static generateSymmetricKey() {
        return CryptoJS.lib.WordArray.random(32).toString();
    }

    static encryptWithSymmetricKey(data, symmetricKey) {
        try {
            const base64Data = this.stringToBase64(data);
            return CryptoJS.AES.encrypt(base64Data, symmetricKey).toString();
        } catch (err) {
            console.error("Encryption error:", err);
            throw new Error("Failed to encrypt data");
        }
    }

    static decryptWithSymmetricKey(encryptedData, symmetricKey) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, symmetricKey);
            const base64Result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!base64Result)
                throw new Error("Decryption resulted in empty string");
            return this.base64ToString(base64Result);
        } catch (err) {
            console.error("Decryption error:", err);
            throw new Error("Failed to decrypt data");
        }
    }

    static encryptSymmetricKey(symmetricKey, publicKey) {
        // For now, use a simple encryption since we don't have RSA implemented
        // In a real app, you'd use Web Crypto API or a library for RSA
        return this.stringToBase64(symmetricKey);
    }

    static decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        // For now, simple base64 decode since we're using symmetric encryption
        // In a real app, you'd decrypt with RSA private key
        return this.base64ToString(encryptedSymmetricKey);
    }

    // ADD THESE MISSING METHODS
    static generateKeyPair() {
        // Mock key pair generation - in real app use Web Crypto API
        return {
            publicKey:
                "mock-public-key-" + Math.random().toString(36).substr(2, 9),
            privateKey:
                "mock-private-key-" + Math.random().toString(36).substr(2, 9),
        };
    }

    static encryptPrivateKey(privateKey, password) {
        // Simple encryption for demo - use proper encryption in production
        return CryptoJS.AES.encrypt(privateKey, password).toString();
    }

    static decryptPrivateKey(encryptedPrivateKey, password) {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedPrivateKey,
                password
            );
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Private key decryption error:", error);
            throw new Error("Failed to decrypt private key - wrong password?");
        }
    }

    static prepareNoteData(noteData, userPublicKey) {
        try {
            console.log("Original note data:", noteData);

            const symmetricKey = this.generateSymmetricKey();
            console.log("Generated symmetric key:", symmetricKey);

            const encryptedTitle = this.encryptWithSymmetricKey(
                noteData.title,
                symmetricKey
            );
            const encryptedContent = this.encryptWithSymmetricKey(
                noteData.content,
                symmetricKey
            );
            const encryptedTags =
                noteData.tags?.map((tag) =>
                    this.encryptWithSymmetricKey(tag, symmetricKey)
                ) || [];
            const encryptedSymmetricKey = this.encryptSymmetricKey(
                symmetricKey,
                userPublicKey
            );

            const preparedData = {
                title: encryptedTitle,
                content: encryptedContent,
                tags: encryptedTags,
                encryptedKey: encryptedSymmetricKey,
                categoryId: noteData.categoryId || null,
                isPinned: noteData.isPinned || false,
            };

            console.log("Prepared encrypted note data:", preparedData);
            return preparedData;
        } catch (err) {
            console.error("Error preparing note data:", err);
            throw new Error("Failed to prepare note data for encryption");
        }
    }

    // ADD THIS MISSING DECRYPTION METHOD
    static decryptNoteData(note, encryptedPrivateKey, password) {
        try {
            // First decrypt the private key with user's password
            const privateKey = this.decryptPrivateKey(
                encryptedPrivateKey,
                password
            );

            // Then decrypt the symmetric key with the private key
            const symmetricKey = this.decryptSymmetricKey(
                note.encryptedKey,
                privateKey
            );

            // Finally decrypt the note content with the symmetric key
            const title = this.decryptWithSymmetricKey(
                note.title,
                symmetricKey
            );
            const content = this.decryptWithSymmetricKey(
                note.content,
                symmetricKey
            );
            const tags =
                note.tags?.map((tag) =>
                    this.decryptWithSymmetricKey(tag, symmetricKey)
                ) || [];

            return {
                title,
                content,
                tags,
            };
        } catch (error) {
            console.error("Error decrypting note data:", error);
            throw new Error("Failed to decrypt note data");
        }
    }
}
