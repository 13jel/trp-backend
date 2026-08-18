import { useState } from 'react';
import { supabase } from '../api/supabaseClient';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  stock: '',
  image_url: '',
  category: '',
  theme: '',
};

const MAX_DIMENSION = 1600; // px, mer än nog för webbvisning

function resizeImage(file, maxDimension = MAX_DIMENSION) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) return reject(new Error('Kunde inte bearbeta bilden'));
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.85 // kvalitet 0-1
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Kunde inte läsa bildfilen'));
    };

    img.src = objectUrl;
  });
}

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

  async function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    try {
      const resized = await resizeImage(selected);
      setFile(resized);
      setPreview(URL.createObjectURL(resized));
    } catch (err) {
      setError(`Kunde inte bearbeta bilden: ${err.message}`);
    }
  }

  async function uploadImage() {
    setUploading(true);
    const path = `${crypto.randomUUID()}.jpg`;

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
          style={{ width: 120, height: 150, objectFit: 'contain', border: '2.5px solid var(--color-ink)', borderRadius: 8, background: 'var(--color-paper)' }}
        />
      )}

      <label>
        Typ
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Välj typ</option>
          <option value="Posters">Posters</option>
          <option value="Tyger & tapeter">Tyger & tapeter</option>
        </select>
      </label>

      <label>
        Tema
        <input
          name="theme"
          value={form.theme || ''}
          onChange={handleChange}
          placeholder="t.ex. Djur, Musik, Botanik"
        />
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