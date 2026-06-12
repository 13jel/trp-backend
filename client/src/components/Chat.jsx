import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const bottomRef = useRef(null);

  async function loadMessages() {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Kunde inte hämta meddelanden:", err);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, text }),
      });
      setText("");
      loadMessages();
    } catch (err) {
      console.error("Kunde inte skicka meddelande:", err);
    }
  }

  return (
    <div className="chat">
      <input
        type="text"
        placeholder="Ditt namn"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <div className="chat__messages">
        {messages.map((m) => (
          <div key={m.id} className="chat__message">
            <strong>{m.user}:</strong> {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat__input">
        <input
          type="text"
          placeholder="Skriv ett meddelande…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Skicka</button>
      </div>
    </div>
  );
}