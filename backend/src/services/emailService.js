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
                name: "LockNote",
                address: process.env.GMAIL_USER,
            },
            to: email,
            subject: "Verify Your Email - LockNote",
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
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        }
                        .verification-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #000000;
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        }
                        .footer {
                            background: #f8f8f8;
                            padding: 20px;
                            text-align: center;
                            border-top: 1px solid #e5e5e5;
                            font-size: 12px;
                            color: #666666;
                        }
                        .button {
                            display: inline-block;
                            background: #000000;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 4px;
                            margin: 10px 0;
                            border: 1px solid #000000;
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
                            <h1 style="margin: 0; font-size: 24px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;">LockNote</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">End-to-End Encrypted Notes</p>
                        </div>
                        
                        <div class="content">
                            <h2 style="margin-top: 0; color: #000000;">Email Verification Required</h2>
                            
                            <p>To complete your LockNote account setup, please verify your email address using the code below:</p>
                            
                            <div class="code-container">
                                <div class="verification-code">${code}</div>
                            </div>
                            
                            <div class="info-box">
                                <strong>Important:</strong> This verification code will expire in <strong>15 minutes</strong>.
                            </div>
                            
                            <p>Enter this code in the verification screen to activate your account and start creating encrypted notes.</p>
                            
                            <p style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 25px;">
                                <small>
                                    If you didn't create a LockNote account, please ignore this email.<br>
                                    Your data security is our priority - all notes are encrypted before they leave your device.
                                </small>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p style="margin: 0;">
                                &copy; 2024 LockNote. All rights reserved.<br>
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
LOCKNOTE - EMAIL VERIFICATION

Verify your email address to complete your LockNote account setup.

Your verification code: ${code}

This code will expire in 15 minutes.

Enter this code in the verification screen to activate your account.

If you didn't create a LockNote account, please ignore this email.

--
LockNote - End-to-End Encrypted Notes
            `,
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
                name: "LockNote",
                address: process.env.GMAIL_USER,
            },
            to: email,
            subject: "Password Reset Request - LockNote",
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
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        }
                        .verification-code {
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #dc3545;
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
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
                            <h1 style="margin: 0; font-size: 24px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;">LockNote</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">End-to-End Encrypted Notes</p>
                        </div>
                        
                        <div class="content">
                            <h2 style="margin-top: 0; color: #000000;">Password Reset Request</h2>
                            
                            <p>We received a request to reset your LockNote account password. Use the code below to proceed:</p>
                            
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
                                    Remember: LockNote cannot recover your encrypted data if you lose your encryption password.
                                </small>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p style="margin: 0;">
                                &copy; 2024 LockNote. All rights reserved.<br>
                                Secure • Encrypted • Private
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
LOCKNOTE - PASSWORD RESET

We received a request to reset your LockNote account password.

Your password reset code: ${code}

This code will expire in 15 minutes.

Enter this code in the password reset screen to create a new password.

If you didn't request this reset, your account may be compromised.

Remember: LockNote cannot recover your encrypted data if you lose your encryption password.

--
LockNote - End-to-End Encrypted Notes
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", result.messageId);
        return result;
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};
