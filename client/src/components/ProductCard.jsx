import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addToCart } from '../api/cart';

export default function ProductCard({ product }) {
  const { token, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle'); // idle | loading | done | error

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

  return (
    <div className="product-card">
      {product.image_url && <img src={product.image_url} alt={product.name} />}
      <h3>{product.name}</h3>
      {product.description && <p>{product.description}</p>}
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
  );
}