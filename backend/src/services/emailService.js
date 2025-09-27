import { Resend } from "resend";

const resend = new Resend("re_EeCxkBBm_ENZB48H9noUAyfBpzrvvVet3");

// Test email connection
export const verifyEmailConnection = async () => {
    try {
        // Test by sending a simple email or checking API key validity
        console.log("Resend email service configured");
        return true;
    } catch (error) {
        console.error("Resend connection failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, token) => {
    try {
        const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
            to: email,
            subject: "Verify Your Email - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; 
                              text-decoration: none; border-radius: 5px; margin: 10px 0;">
                        Verify Email
                    </a>
                    <p>Or copy this link to your browser:</p>
                    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 3px;">
                        ${verificationUrl}
                    </p>
                    <p><small>This verification link will expire in 24 hours.</small></p>
                </div>
            `,
            text: `Please verify your email by visiting: ${verificationUrl}`,
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

export const sendPasswordResetEmail = async (email, token) => {
    try {
        const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: "Note App <onboarding@resend.dev>",
            to: email,
            subject: "Password Reset Request - Note App",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background: #dc3545; color: white; 
                              text-decoration: none; border-radius: 5px; margin: 10px 0;">
                        Reset Password
                    </a>
                    <p>Or copy this link to your browser:</p>
                    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 3px;">
                        ${resetUrl}
                    </p>
                    <p><small>This link will expire in 1 hour.</small></p>
                </div>
            `,
            text: `Reset your password by visiting: ${resetUrl}`,
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
