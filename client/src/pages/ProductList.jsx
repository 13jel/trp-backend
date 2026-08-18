import { useMemo, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const TYPES = ['Posters', 'Tyger & tapeter'];

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const [activeType, setActiveType] = useState('Alla');
  const [activeTheme, setActiveTheme] = useState('Alla');

  const themes = useMemo(() => {
    const unique = new Set(products.map((p) => p.theme).filter(Boolean));
    return ['Alla', ...Array.from(unique).sort()];
  }, [products]);

  const filtered = products.filter((p) => {
    const typeMatch = activeType === 'Alla' || p.category === activeType;
    const themeMatch = activeTheme === 'Alla' || p.theme === activeTheme;
    return typeMatch && themeMatch;
  });

  if (loading) return <p>Laddar produkter...</p>;
  if (error) return <p>Kunde inte hämta produkter: {error}</p>;
  if (products.length === 0) return <p>Inga produkter tillgängliga än.</p>;

  return (
    <div className="product-list">
      <h1>Produkter</h1>

      <div className="filter-bar">
        <div className="filter-group">
          <button
            className={activeType === 'Alla' ? 'active' : ''}
            onClick={() => setActiveType('Alla')}
          >
            Alla
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              className={activeType === type ? 'active' : ''}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {themes.length > 1 && (
          <label className="theme-select">
            Tema
            <select value={activeTheme} onChange={(e) => setActiveTheme(e.target.value)}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {filtered.length === 0 ? (
        <p>Inga produkter matchar filtret.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}