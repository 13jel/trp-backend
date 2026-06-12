import express from "express";

const router = express.Router();

let messages = [];
let nextId = 1;

router.get("/", (req, res) => {
  res.json(messages);
});

router.post("/", (req, res) => {
  const { user, text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Meddelandet får inte vara tomt" });
  }

  const message = {
    id: nextId++,
    user: user?.trim() || "Anonym",
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  res.status(201).json(message);
});

export default router;