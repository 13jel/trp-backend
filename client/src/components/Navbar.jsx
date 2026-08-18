import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">TRP</Link>

      <div className="navbar-links">
        <Link to="/products">Produkter</Link>
        <Link to="/gallery">Galleri</Link>
        {session && <Link to="/cart">Varukorg</Link>}
        {session && <Link to="/account">Mina sidor</Link>}
        {isAdmin && <Link to="/admin/products">Admin</Link>}
        {session ? (
          <button onClick={handleSignOut}>Logga ut</button>
        ) : (
          <Link to="/login">Logga in</Link>
        )}
      </div>
    </nav>
  );
}