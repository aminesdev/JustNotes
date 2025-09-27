import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
    host: "mail.proton.me",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email - Note App",
        html: `
            <h2>Email Verification</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Verify Email
            </a>
            <p>Or copy this link: ${verificationUrl}</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.APP_URL}/api/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request - Note App",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
