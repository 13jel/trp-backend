import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ROTATE_INTERVAL = 4500;
const VISIBLE_COUNT = 3;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function HeroCarousel() {
  const { products, loading } = useProducts();

  const slides = useMemo(() => {
    const withImages = products.filter((p) => p.image_url);
    return shuffle(withImages).slice(0, 8);
  }, [products]);

  const [start, setStart] = useState(0);

  useEffect(() => {
    if (slides.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      setStart((prev) => (prev + 1) % slides.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading || slides.length === 0) return null;

  const visibleCount = Math.min(VISIBLE_COUNT, slides.length);
  const visible = Array.from(
    { length: visibleCount },
    (_, i) => slides[(start + i) % slides.length]
  );

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-track">
        {visible.map((product) => (
          <Link to={`/products/${product.id}`} className="hero-carousel-slide" key={product.id}>
            <img src={product.image_url} alt={product.name} />
          </Link>
        ))}
      </div>

      {slides.length > visibleCount && (
        <div className="hero-carousel-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={i === start ? 'active' : ''}
              onClick={() => setStart(i)}
              aria-label={`Visa från ${slide.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}