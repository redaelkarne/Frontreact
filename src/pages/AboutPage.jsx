import React from "react";
import './AboutPage.css';

export default function AboutPage() {
  return (
    <>
      <section className="about-section" style={{ width: '100vw', height: '100vh', minHeight: '100vh', position: 'relative', background: '#fff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <div className="about-bg-text">hautes-alpes - aventure -</div>

        <div className="about-content">
          <div className="about-left">
            <h1>À propos de <br />la créatrice</h1>
            <p>Je m'appelle Audrey, créatrice de la marque @audelweiss.craft.</p>
            <p>
            J’ai grandi à <b>Embrun</b>, une petite ville nichée <b>au cœur des Hautes-Alpes</b>, entourée de montagnes et de paysages grandioses. Ces racines alpines ont forgé mon amour de la nature et de l’authenticité, des valeurs qui m’accompagnent toujours aujourd’hui.
            </p>
          </div>

          <div className="about-right">
            <div className="about-img-main">
              <img src="https://audelweiss.fr/wp-content/uploads/2025/02/4104fbf5c55d4d538cff844b8c94c2e3-scaled.webp" alt="Créations" />
            </div>
            <div className="about-img-portrait">
              <img src="https://audelweiss.fr/wp-content/uploads/2025/02/pexels-anete-lusina-4792084-scaled.jpg.webp" alt="Portrait créatrice" />
            </div>
          </div>
        </div>
      </section>

      <section className="story-columns-wrapper">
  <div className="story-columns">
    <div className="story-block">
      <span className="story-number">01</span>
      <h3>UN RETOUR AUX SOURCES</h3>
      <p>
        En 2022, lassée par la vie à Lyon (que je n’ai jamais vraiment aimée), j’ai choisi de revenir m’établir dans l’Embrunais pour retrouver un équilibre de vie et nourrir mon inspiration créative.
      </p>
    </div>

    <div className="story-block">
      <span className="story-number">02</span>
      <h3>LA DÉCOUVERTE DU CROCHET</h3>
      <p>
        C’est au cours du deuxième semestre 2024 que j’ai découvert une nouvelle passion : le crochet. Ce fut une révélation. Rapidement, j’ai commencé à créer des pièces uniques, à la fois positives et colorées, avec l’envie d’apporter un peu de douceur et de joie dans le quotidien des autres. Chaque création est imprégnée de l’énergie du Reiki, une discipline que je pratique depuis 2021.
      </p>
    </div>

    <div className="story-block">
      <span className="story-number">03</span>
      <h3>L’ORIGINE DE LA MARQUE</h3>
      <p>
        Le nom de ma marque, <strong>Audelweiss</strong>, n’est pas anodin. Il est né de l’association de mon premier et de mon troisième prénom, Edelweiss, éponyme de cette fleur rare qui pousse en altitude et symbolise la pureté et la résilience. Ce choix reflète mon attachement profond à mes montagnes haut-alpines.
      </p>
    </div>
  </div>
</section>

<section className="about-career-section">
  <div className="about-career-content">
    <h2>MON PARCOURS PROFESSIONNEL</h2>
    <p>
      Après des études en informatique et en création de sites internet, je me suis installée à Lyon pour développer mes compétences dans le digital. Le web, en constante évolution, m’a permis d’<b>explorer la création sous diverses formes, alliant technique et esthétique</b>. Cette immersion dans la conception digitale a posé les bases de ma démarche artistique.<br />
      Aujourd’hui freelance spécialisée en développement web et design UI/UX, je transmets également mon savoir en tant que formatrice.
    </p>
    <p>
      Cette aventure créative s’est enrichie avec ma découverte du crochet, une nouvelle forme d’expression artistique qui me permet d’allier matières, couleurs et énergie.
    </p>
    <a href="https://audreyhossepian.fr/" className="about-career-link">Découvrir mon site freelance</a>
  </div>
  <div className="about-career-image">
    <img src="https://audelweiss.fr/wp-content/uploads/2025/02/moidev.jpg.webp" alt="Portrait professionnel" />
  </div>
</section>

    </>
  );
}
