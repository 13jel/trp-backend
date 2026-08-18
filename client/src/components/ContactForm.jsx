import { useState } from 'react';
import { sendContactMessage } from '../api/contact';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContactMessage(form);
      setStatus('done');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return <p className="contact-success">Tack! Ditt meddelande är skickat, du hör av dig snart.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <label>
        Namn
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        E-post
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </label>

      <label>
        Meddelande
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Berätta gärna vad du har i åtanke – företag, stil, tidsram..."
          required
        />
      </label>

      {status === 'error' && <p className="form-error">Något gick fel, försök gärna igen.</p>}

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Skickar...' : 'Skicka förfrågan'}
      </button>
    </form>
  );
}