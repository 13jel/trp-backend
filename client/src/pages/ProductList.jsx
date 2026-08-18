import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Laddar produkter...</p>;
  if (error) return <p>Kunde inte hämta produkter: {error}</p>;
  if (products.length === 0) return <p>Inga produkter tillgängliga än.</p>;

  return (
    <div className="product-list">
      <h1>Produkter</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}