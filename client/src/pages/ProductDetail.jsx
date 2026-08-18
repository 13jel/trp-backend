import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../hooks/useProduct';
import { addToCart } from '../api/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { token, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle');

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

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← Tillbaka till produkter</Link>

      <div className="product-detail-layout">
        {product.image_url && <img src={product.image_url} alt={product.name} />}

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          {product.category && <p className="category-tag">{product.category}</p>}
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
      </div>
    </div>
  );
}