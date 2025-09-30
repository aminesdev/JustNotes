import nodemailer from "nodemailer";
import { checkEmailRateLimit } from "../middlewares/emailRateLimit.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log("Nodemailer Gmail service configured successfully");
        return true;
    } catch (error) {
        console.error("Nodemailer connection failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        await checkEmailRateLimit(email);
        const mailOptions = {
            from: {
                name: "Note App",
                address: process.env.GMAIL_USER,
            },
            to: email,
            subject: "Verify Your Email - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p><small>This code will expire in 15 minutes.</small></p>
                    <p><small>If you didn't request this code, please ignore this email.</small></p>
                </div>
            `,
            text: `Your verification code is: ${code}. This code will expire in 15 minutes.`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", result.messageId);
        return result;
    } catch (error) {
        if (error.message.includes("rate limit")) {
            throw error;
        }
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

export const sendPasswordResetEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: {
                name: "Note App",
                address: process.env.GMAIL_USER,
            },
            to: email,
            subject: "Password Reset Request - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p>Your password reset code is:</p>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #dc3545; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p><small>This code will expire in 15 minutes.</small></p>
                    <p><small>If you didn't request this code, please ignore this email and your password will remain unchanged.</small></p>
                </div>
            `,
            text: `Your password reset code is: ${code}. This code will expire in 15 minutes.`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", result.messageId);
        return result;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
