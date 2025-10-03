import { Resend } from "resend";
import { checkEmailRateLimit } from "../middlewares/emailRateLimit.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
    try {
        console.log("Resend email service configured");
        console.log("=== Email Configuration Check ===");
        console.log(
            "RESEND_API_KEY:",
            process.env.RESEND_API_KEY ? "Configured" : "Missing"
        );
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
            from: "JustNotes <onboarding@resend.dev>",
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
                            
                            <p style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 25px;">
                                <small>
                                    If you didn't create a JustNotes account, please ignore this email.<br>
                                    Your data security is our priority - all notes are encrypted before they leave your device.
                                </small>
                            </p>
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
            text: `
JustNotes - EMAIL VERIFICATION

Verify your email address to complete your JustNotes account setup.

Your verification code: ${code}

This code will expire in 15 minutes.

Enter this code in the verification screen to activate your account.

If you didn't create a JustNotes account, please ignore this email.

--
JustNotes - End-to-End Encrypted Notes
            `,
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log("Verification email sent:", data.id);
        return data;
    } catch (error) {
        if (error.message && error.message.includes("rate limit")) {
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
                            border-bottom: 3px solid #dc3545;
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
                            color: #dc3545;
                        }
                        .footer {
                            background: #f8f8f8;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e5e5e5;
                            font-size: 12px;
                            color: #666666;
                        }
                        .warning-box {
                            background: #fff3f3;
                            border-left: 4px solid #dc3545;
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
                            <h2 style="margin-top: 0; color: #000000;">Password Reset Request</h2>
                            
                            <p>We received a request to reset your JustNotes account password. Use the code below to proceed:</p>
                            
                            <div class="code-container">
                                <div class="verification-code">${code}</div>
                            </div>
                            
                            <div class="warning-box">
                                <strong>Security Notice:</strong> This reset code will expire in <strong>15 minutes</strong>.
                                If you didn't request this reset, your account may be compromised.
                            </div>
                            
                            <p>Enter this code in the password reset screen to create a new password for your account.</p>
                            
                            <p style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 25px;">
                                <small>
                                    For your security, this code can only be used once.<br>
                                    Remember: JustNotes cannot recover your encrypted data if you lose your encryption password.
                                </small>
                            </p>
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
            text: `
JustNotes - PASSWORD RESET

We received a request to reset your JustNotes account password.

Your password reset code: ${code}

This code will expire in 15 minutes.

Enter this code in the password reset screen to create a new password.

If you didn't request this reset, your account may be compromised.

Remember: JustNotes cannot recover your encrypted data if you lose your encryption password.

--
JustNotes - End-to-End Encrypted Notes
            `,
        });

        if (error) {
            console.error("Resend API error:", error);
            throw error;
        }

        console.log("Password reset email sent:", data.id);
        return data;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
