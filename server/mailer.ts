import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"The Rooted Pages" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}