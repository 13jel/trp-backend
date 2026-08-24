import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCart, removeFromCart, updateCartItemQuantity } from '../api/cart';
import { createOrder } from '../api/orders';
import { fetchMyProfile } from '../api/account';

export default function Cart() {
  const { user, token, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      navigate('/login');
      return;
    }

    fetchCart(token)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Förifyll leveransadress med kundens sparade standardadress, om den finns
    fetchMyProfile(user.id)
      .then((profile) => {
        if (profile.address) setShippingAddress(profile.address);
      })
      .catch(() => {
        // Ingen adress sparad än, eller kunde inte hämtas — inget att göra, bara låt fältet vara tomt
      });
  }, [authLoading, session, token, navigate, user]);

  async function handleRemove(cartItemId) {
    try {
      await removeFromCart(token, cartItemId);
      setItems((prev) => prev.filter((i) => i.id !== cartItemId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleQuantityChange(item, newQuantity) {
    if (newQuantity < 1) {
      handleRemove(item.id);
      return;
    }
    if (newQuantity > item.product.stock) {
      setError(`Endast ${item.product.stock} st av "${item.product.name}" finns i lager.`);
      return;
    }
    setUpdatingId(item.id);
    try {
      await updateCartItemQuantity(token, item.product.id, newQuantity);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function handleGoToConfirm(e) {
    e.preventDefault();
    setConfirming(true);
  }

  async function handleConfirmPurchase() {
    setPlacing(true);
    setError(null);
    try {
      const order = await createOrder(token, shippingAddress);
      setOrderDone(order);
      setItems([]);
      setConfirming(false);
    } catch (err) {
      setError(err.message);
      setConfirming(false);
    } finally {
      setPlacing(false);
    }
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  if (authLoading || loading) return <p>Laddar...</p>;

  if (orderDone) {
    return (
      <div className="cart-page">
        <h1>Tack för din beställning!</h1>
        <p>Order #{orderDone.id} har lagts. En faktura skickas till din e-post.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Varukorg</h1>
        <p>Din varukorg är tom.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Varukorg</h1>

      {error && <p className="form-error">{error}</p>}

      <ul className="cart-items">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <Link to={`/products/${item.product.id}`} className="cart-item-name">
              {item.product.name}
            </Link>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                disabled={updatingId === item.id}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                disabled={updatingId === item.id}
              >
                +
              </button>
            </div>

            <span>{item.quantity * item.product.price} slantar</span>
            <button onClick={() => handleRemove(item.id)}>Ta bort</button>
          </li>
        ))}
      </ul>

      <p className="cart-total">Totalt: {total} slantar</p>

      {!confirming ? (
        <form onSubmit={handleGoToConfirm} className="checkout-form">
          <label>
            Leveransadress
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </label>

          <button type="submit">Betala</button>
        </form>
      ) : (
        <div className="confirm-dialog">
          <h2>Bekräfta köp</h2>
          <p>
            Du köper {items.length} {items.length === 1 ? 'vara' : 'varor'} för{' '}
            <strong>{total} slantar</strong>.
          </p>
          <p>Levereras till: {shippingAddress}</p>

          <div className="confirm-actions">
            <button onClick={handleConfirmPurchase} disabled={placing}>
              {placing ? 'Bearbetar...' : 'Bekräfta köp'}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={placing}>
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}