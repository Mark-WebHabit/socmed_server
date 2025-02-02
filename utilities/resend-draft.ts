import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cert = fs.readFileSync(
  path.join(__dirname, "..", "cert", "certificate.crt")
);

const key = fs.readFileSync(path.join(__dirname, "..", "cert", "private.key"));

export const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true, // Set to true if using port 465
  auth: {
    user: "resend",
    pass: "re_Ach9w58v_NynG8WVCaiN4wRe9hHa4kFpv",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Set up email data
const mailOptions = {
  from: "markbobis173@gmail.com",
  to: "markbobis173@gmail.com",
  subject: "Hello World",
  html: "<strong>It works!</strong>",
};

export const sendEmail = async () => {
  console.log(process.env.APP_EMAIL);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
