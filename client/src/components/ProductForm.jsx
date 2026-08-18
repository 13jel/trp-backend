import { useState } from 'react';
import { supabase } from '../api/supabaseClient';

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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialProduct?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function uploadImage() {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file);

    setUploading(false);

    if (uploadError) {
      throw new Error(`Bilduppladdning misslyckades: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let image_url = form.image_url;
      if (file) {
        image_url = await uploadImage();
      }

      await onSubmit({
        ...form,
        image_url,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      });

      if (!initialProduct) {
        setForm(emptyProduct);
        setFile(null);
        setPreview(null);
      }
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
        Produktbild
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Förhandsvisning"
          style={{ width: 120, height: 120, objectFit: 'cover', border: '2.5px solid var(--color-ink)', borderRadius: 8 }}
        />
      )}

      <label>
        Kategori
        <input name="category" value={form.category} onChange={handleChange} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {uploading ? 'Laddar upp bild...' : saving ? 'Sparar...' : initialProduct ? 'Spara ändringar' : 'Lägg till produkt'}
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