export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        The Rooted Pages © {year} All artwork by Julia Lindström. All rights reserved.
      </p>
    </footer>
  );
}