import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../hooks/useProduct';
import { addToCart } from '../api/cart';
import { parseThemes } from '../utils/theme';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { token, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle');
  const [activeImage, setActiveImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  async function handleAddToCart() {
    if (!session) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setStatus('loading');
    try {
      await addToCart(token, product.id, 1);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
    }
  }

  if (loading) return <p>Laddar produkt...</p>;
  if (error || !product) return <p>Produkten kunde inte hittas.</p>;

  const gallery = [
    product.image_url,
    ...(product.product_images?.map((i) => i.image_url) || []),
  ].filter(Boolean);
  const mainImage = activeImage || gallery[0];

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← Tillbaka till produkter</Link>

      {mainImage && (
        <button
          type="button"
          className="product-detail-main-image-wrap"
          onClick={() => setLightboxOpen(true)}
        >
          <img src={mainImage} alt={product.name} className="product-detail-main-image" />
          <span className="zoom-hint">Klicka för att förstora</span>
        </button>
      )}

      {gallery.length > 1 && (
        <div className="product-detail-thumbs">
          {gallery.map((url) => (
            <button
              key={url}
              type="button"
              className={url === mainImage ? 'active' : ''}
              onClick={() => setActiveImage(url)}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className="product-detail-info">
        <h1>{product.name}</h1>

        {product.category && <p className="category-tag">{product.category}</p>}

        {parseThemes(product.theme).length > 0 && (
          <div className="theme-tags">
            {parseThemes(product.theme).map((theme) => (
              <span key={theme} className="theme-tag">{theme}</span>
            ))}
          </div>
        )}

        {product.description && <p className="description">{product.description}</p>}

        <p className="price">{product.price} slantar</p>
        <p className="stock">
          {product.stock > 0 ? `${product.stock} i lager` : 'Slut i lager'}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || status === 'loading'}
        >
          {status === 'loading' && 'Lägger till...'}
          {status === 'done' && 'Tillagd!'}
          {status === 'idle' && 'Lägg i varukorg'}
          {status === 'error' && 'Något gick fel'}
        </button>
      </div>

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Stäng"
          >
            ×
          </button>
          <img src={mainImage} alt={product.name} className="lightbox-image" />
        </div>
      )}
    </div>
  );
}