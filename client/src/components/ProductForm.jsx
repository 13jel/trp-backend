import { useState } from 'react';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stock: '',
  image_url: '',
  category: '',
};

export default function ProductForm({ initialProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialProduct || emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      });
      if (!initialProduct) setForm(emptyProduct);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <label>
        Namn
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        Beskrivning
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>

      <label>
        Pris (slantar)
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Lagersaldo
        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Bild-URL
        <input name="image_url" value={form.image_url} onChange={handleChange} />
      </label>

      <label>
        Kategori
        <input name="category" value={form.category} onChange={handleChange} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Sparar...' : initialProduct ? 'Spara ändringar' : 'Lägg till produkt'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={saving}>
            Avbryt
          </button>
        )}
      </div>
    </form>
  );
}