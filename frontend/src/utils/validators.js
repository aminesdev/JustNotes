export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateNoteTitle = (title) => {
    return title && title.trim().length > 0 && title.length <= 5000;
};

export const validateNoteContent = (content) => {
    return content && content.trim().length > 0 && content.length <= 100000;
};

export const validateBase64 = (value) => {
    if (!value) return false;
    try {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        return base64Regex.test(value) && value.length % 4 === 0;
    } catch {
        return false;
    }
};