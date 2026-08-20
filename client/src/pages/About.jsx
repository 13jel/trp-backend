export default function About() {
  return (
    <div className="about-page">
      <h1>Om The Rooted Pages</h1>

      <section className="about-section">
        <h2>Detta är ett skolprojekt</h2>
        <p>
          The Rooted Pages är byggd som examinationsuppgift i systemutveckling på FSU25D,
          Medieinstitutet. Sidan demonstrerar en fullständig e-handelslösning — databas,
          inloggning, admin-panel, varukorg och orderhantering — men fungerar inte som en
          riktig butik.
        </p>
      </section>

      <section className="about-section">
        <h2>Produkter och beställningar</h2>
        <p>
          Produkterna på sidan går att lägga i varukorg och "beställa" precis som i en riktig
          butik, för att visa hela flödet från produktval till order. Men <strong>inga fysiska
          varor skickas</strong> och <strong>ingen riktig betalning sker</strong> — valutan
          "slantar" är påhittad för uppgiften. En bekräftelsefaktura skickas via mejl som en del
          av demonstrationen, men det är ingen riktig kvittens på köp.
        </p>
      </section>

      <section className="about-section">
        <h2>Galleriet är på riktigt</h2>
        <p>
          Till skillnad från produkterna tar jag faktiskt emot riktiga förfrågningar via
          kontaktformuläret i <a href="/gallery">galleriet</a> — om du vill beställa en
          logotyp eller liknande hör jag gärna av mig.
        </p>
      </section>

      <section className="about-section">
        <h2>Om dina uppgifter</h2>
        <p>
          Om du skapar ett konto och lägger en testorder sparas namn, e-post, adress och
          orderhistorik i databasen precis som i en riktig e-handel — det är en del av det
          som examineras. Uppgifterna används inte i något annat syfte och delas inte vidare.
          Hör gärna av dig om du vill att din data ska tas bort.
        </p>
      </section>
    </div>
  );
}