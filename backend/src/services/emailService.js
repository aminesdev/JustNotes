import { Resend } from "resend";
import { checkEmailRateLimit } from "../middlewares/emailRateLimit.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
    try {
        console.log("Resend email service configured");
        return true;
    } catch (error) {
        console.error("Resend configuration failed:", error);
        return false;
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        await checkEmailRateLimit(email);

        const { data, error } = await resend.emails.send({
            from: "JustNotes <onboarding@resend.dev>", // Free test domain
            to: email,
            subject: "Verify Your Email - JustNotes",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                            background-color: #ffffff;
                            color: #000000;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border: 1px solid #e5e5e5;
                        }
                        .header {
                            background: #000000;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border-bottom: 3px solid #6B73FF;
                        }
                        .content {
                            padding: 30px;
                        }
                        .code-container {
                            background: #f8f8f8;
                            border: 2px solid #000000;
                            border-radius: 4px;
                            padding: 25px;
                            margin: 25px 0;
                            text-align: center;
                        }
                        .verification-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #000000;
                        }
                        .footer {
                            background: #f8f8f8;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e5e5e5;
                            font-size: 12px;
                            color: #666666;
                        }
                        .info-box {
                            background: #f8f8f8;
                            border-left: 4px solid #6B73FF;
                            padding: 15px;
                            margin: 20px 0;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px;">JustNotes</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">End-to-End Encrypted Notes</p>
                        </div>
                        
                        <div class="content">
                            <h2 style="margin-top: 0; color: #000000;">Email Verification Required</h2>
                            
                            <p>To complete your JustNotes account setup, please verify your email address using the code below:</p>
                            
                            <div class="code-container">
                                <div class="verification-code">${code}</div>
                            </div>
                            
                            <div class="info-box">
                                <strong>Important:</strong> This verification code will expire in <strong>15 minutes</strong>.
                            </div>
                            
                            <p>Enter this code in the verification screen to activate your account and start creating encrypted notes.</p>
                        </div>
                        
                        <div class="footer">
                            <p style="margin: 0;">
                                &copy; 2024 JustNotes. All rights reserved.<br>
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            throw error;
        }

        console.log("Verification email sent:", data.id);
        return data;
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
        const { data, error } = await resend.emails.send({
            from: "JustNotes <onboarding@resend.dev>",
            to: email,
            subject: "Password Reset Request - JustNotes",
            html: `<!-- your existing password reset HTML with ${code} -->`,
        });

        if (error) {
            throw error;
        }

        console.log("Password reset email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
