export const tokenUtils = {
    isTokenExpired: (token) => {
        if (!token) return true;

        try {
            // For JWT tokens, check expiration
            if (token.includes(".")) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                console.log(`🔐 Token expiration check:`, {
                    expires: new Date(payload.exp * 1000),
                    now: new Date(),
                    isExpired,
                });
                return isExpired;
            }
            // For demo tokens, consider them valid
            console.log("🔐 Demo token - considered valid");
            return false;
        } catch (error) {
            console.error("❌ Token validation error:", error);
            return true;
        }
    },

    getTokenExpiration: (token) => {
        if (!token) return null;

        try {
            if (token.includes(".")) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return new Date(payload.exp * 1000);
            }
            return null;
        } catch {
            return null;
        }
    },

    decodeToken: (token) => {
        if (!token) return null;

        try {
            if (token.includes(".")) {
                return JSON.parse(atob(token.split(".")[1]));
            }
            return { type: "demo-token" };
        } catch {
            return null;
        }
    },
};
