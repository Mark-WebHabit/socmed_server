import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASS } from "./constant.js";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: APP_EMAIL,
        pass: APP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
export const sendEmail = async (email, data) => {
    if (!APP_PASS || !APP_EMAIL) {
        throw new Error("App Email or App Password Missing");
    }
    const verificationLink = `${process.env.BASE_URL}/verify/${data}`;
    const mailOptions = {
        from: APP_EMAIL,
        to: email,
        subject: "Verify Your Account",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2>Account Verification</h2>
      <p>Thank you for signing up! Please verify your account by clicking the button below. The link is valid for 1 hour.</p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Verify Account</a>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>Your Company</p>
    </div>
  `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
