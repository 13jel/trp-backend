import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>The Rooted Pages</h1>
        <p>Handgjorda tapeter, tyger och posters.</p>
        <Link to="/products" className="cta-button">
          Se produkter
        </Link>
      </section>
    </div>
  );
}