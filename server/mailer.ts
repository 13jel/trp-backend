import nodemailer from "nodemailer";
import dns from "dns";

// Tvingar Node att föredra IPv4 vid uppslagning, annars försöker Render
// nå Gmail via IPv6 vilket ger ENETUNREACH i Renders nätverksmiljö
dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
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