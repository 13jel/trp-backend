import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAllProductsAdmin, createProduct, updateProduct } from '../api/adminProducts';
import ProductForm from '../components/ProductForm';

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetchAllProductsAdmin(token)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCreate(product) {
    const newProduct = await createProduct(token, product);
    setProducts((prev) => [...prev, newProduct]);
  }

  async function handleUpdate(id, updates) {
    const updated = await updateProduct(token, id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  return (
    <div className="admin-products">
      <nav className="admin-subnav">
        <Link to="/admin/products" className="active">Produkter</Link>
        <Link to="/admin/orders">Ordrar</Link>
      </nav>

      <h1>Admin – Produkter</h1>

      <section>
        <h2>Lägg till ny produkt</h2>
        <ProductForm onSubmit={handleCreate} />
      </section>

      <section>
        <h2>Befintliga produkter</h2>
        {loading && <p>Laddar...</p>}
        {error && <p className="form-error">{error}</p>}

        <ul className="admin-product-list">
          {products.map((product) => (
            <li key={product.id}>
              {editingId === product.id ? (
                <ProductForm
                  initialProduct={product}
                  onSubmit={(updates) => handleUpdate(product.id, updates)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="admin-product-row">
                  <span>{product.name}</span>
                  <span>{product.price} slantar</span>
                  <span>{product.stock} st</span>
                  <button onClick={() => setEditingId(product.id)}>Redigera</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}