import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ROTATE_INTERVAL = 4500;

export default function HeroCarousel() {
  const { products, loading } = useProducts();
  const [index, setIndex] = useState(0);

  const slides = products.filter((p) => p.image_url).slice(0, 8);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading || slides.length === 0) return null;

  const current = slides[index];

  return (
    <div className="hero-carousel">
      <Link to={`/products/${current.id}`} className="hero-carousel-slide">
        <img src={current.image_url} alt={current.name} key={current.id} />
        <div className="hero-carousel-caption">
          <span className="hero-carousel-name">{current.name}</span>
          <span className="hero-carousel-price">{current.price} slantar</span>
        </div>
      </Link>

      {slides.length > 1 && (
        <div className="hero-carousel-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Visa ${slide.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}