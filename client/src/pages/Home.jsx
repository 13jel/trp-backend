import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>The Rooted Pages</h1>
        <p>Handgjorda posters, tapeter och tyger.</p>
        <Link to="/products" className="cta-button">
          Se produkter
        </Link>
      </section>

      <HeroCarousel />
    </div>
  );
}