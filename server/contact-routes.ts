import { Router, Request, Response } from "express";
import { sendMail } from "./mailer.js";

const contactRouter = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

contactRouter.post("/", async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Namn, e-post och meddelande krävs" });
  }

  try {
    await sendMail(
      process.env.CONTACT_EMAIL!,
      `Ny förfrågan från ${name} (The Rooted Pages)`,
      `<p><strong>Namn:</strong> ${name}</p>
      <p><strong>E-post:</strong> ${email}</p>
      <p><strong>Meddelande:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>`
    );
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Kunde inte skicka kontaktmejl:", err);
    res.status(500).json({ error: "Kunde inte skicka meddelandet" });
  }
});

export default contactRouter;