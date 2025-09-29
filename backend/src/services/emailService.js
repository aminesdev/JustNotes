import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
    try {
        console.log("Resend email service configured");
        return true;
    } catch (error) {
        console.error("Resend connection failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
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
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send verification email");
        }

        console.log("Verification email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

export const sendPasswordResetEmail = async (email, code) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
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
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send password reset email");
        }

        console.log("Password reset email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};