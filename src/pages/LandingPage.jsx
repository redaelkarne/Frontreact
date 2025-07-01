import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const animatedWords = [
  "uniques",
  "faites-main",
  "douces",
  "colorées",
  "sur mesure"
];

const categories = [
  {
    name: "Bandeaux",
    img: "https://audelweiss.fr/wp-content/uploads/2025/02/bandeaufantaisie.jpg.webp",
    link: "/bandeaux"
  },
  {
    name: "Fleurs",
    img: "https://audelweiss.fr/wp-content/smush-webp/2025/04/Illustration_sans_titre-1.png.webp",
    link: "/fleurs"
  },
  {
    name: "Porte-clé",
    img: "https://audelweiss.fr/wp-content/uploads/2025/02/porte-cle.jpg.webp",
    link: "/porte-cle"
  }
];

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % animatedWords.length);
    }, 1800); // Change toutes les 1.8 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      <div
        className="hero-section-full"
        style={{
          backgroundImage: 'url("https://audelweiss.fr/wp-content/smush-webp/2025/04/backgroundall.png.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100vw',
          position: 'relative'
        }}
      >
        <div className="hero-content-full">
          <h1>
            Des créations{" "}
            <span className="highlight animated-word">
              {animatedWords[currentWord]}
            </span>
            <br />
            crochetées et gravées
          </h1>
          <p>
            Chaque pièce est soigneusement confectionnée à la main dans les Hautes-Alpes. Offre-toi (ou à tes proches) un savoir-faire inspiré de la montagne, alliant douceur et originalité.
          </p>
          <button className="hero-btn">Découvrir la boutique</button>
        </div>
        <div className="hero-badge-full">
          <span className="et_pb_image_wrap">
            <img
              src="https://audelweiss.fr/wp-content/uploads/2025/02/made-in-france.png.webp"
              alt="Made in France"
              width="90"
              height="90"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </span>
        </div>
      </div>

      {/* 3 COLONNES */}
      <div className="columns-section">
        <div className="column">
          <div className="column-number">01</div>
          <h2>ARTISANAT EMBRUNAIS</h2>
          <p>
            Je vis dans les Hautes-Alpes, un cadre qui m'inspire chaque jour. Toutes mes créations sont réalisées ici, à la main, avec des matériaux choisis avec soin. J'aime l'idée de proposer des pièces qui portent en elles un peu de cette authenticité montagnarde.
          </p>
        </div>
        <div className="column">
          <div className="column-number">02</div>
          <h2>ÉDITIONS LIMITÉES OU SUR-MESURE</h2>
          <p>
            Je suis une créatrice curieuse, toujours en quête de nouvelles idées. J'aime tester des techniques, des couleurs et des matières différentes. Cette envie d'explorer donne naissance à des pièces variées : certaines sont produites en petites séries, d'autres peuvent être personnalisées selon vos goûts et vos besoins.
          </p>
        </div>
        <div className="column">
          <div className="column-number">03</div>
          <h2>PERSONNALISATION SUR DEMANDE</h2>
          <p>
            Crochet, gravure ou flocage : je réalise des créations personnalisées pour ta décoration ou des cadeaux ! Certains produits de la boutique sont personnalisables, mais je peux tout à fait personnaliser un objet que tu as déjà en ta possession. <span className="highlight">Ecris–moi</span> pour en savoir plus ✨
          </p>
        </div>
      </div>

      {/* BANDEAU CATÉGORIES */}
      <section className="categories-banner">
        <div className="categories-banner-top">
          <span>• LES CATÉGORIES • • • LES CATÉGORIES • • • LES CATÉGORIES • • • LES CATÉGORIES •</span>
        </div>
        <div className="categories-banner-content">
          <div className="categories-left">
            <img
              src={categories[hovered].img}
              alt={categories[hovered].name}
              style={{ width: 340, height: 340, borderRadius: 18, objectFit: "cover", boxShadow: "0 2px 12px #e0d6d0" }}
            />
          </div>
          <div className="categories-center">
            <h2>
              {categories.map((cat, idx) => (
                <Link
                  key={cat.name}
                  to={cat.link}
                  style={{
                    display: "block",
                    color: hovered === idx ? "#f47b9b" : "#3a3937",
                    fontWeight: hovered === idx ? "bold" : "normal",
                    textDecoration: "none",
                    fontSize: "2.2rem",
                    margin: "10px 0",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(hovered)}
                >
                  {cat.name}
                </Link>
              ))}
            </h2>
            <button className="boutique-btn">Voir la boutique</button>
          </div>
        </div>
      </section>

      {/* SECTION PRODUITS EN PROMO */}
      <section className="promo-section">
        <h2>
          Des créations <span className="italic">artisanales</span> uniques
        </h2>
        <p>
          Fait main avec <span className="bold">passion</span>, pour toi et ceux que tu aimes ✨
        </p>
        <div className="products-list">
          <div className="product-card">
            <div className="promo-label">EN PROMO !</div>
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="Produit 1" className="product-image" />
            <button className="product-btn">+ Choix des options</button>
            <div className="product-rating">★★★★★</div>
            <div className="product-title">SCRUNCHY | Tricotin•e</div>
            <div className="product-price">4.00€</div>
          </div>
          <div className="product-card">
            <div className="promo-label">EN PROMO !</div>
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Produit 2" className="product-image" />
            <button className="product-btn">+ Choix des options</button>
            <div className="product-title">Dessous de plat en liège gravé | Hautes-Alpes</div>
            <div className="product-price">12.00€</div>
          </div>
          <div className="product-card">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Produit 3" className="product-image" />
            <button className="product-btn">+ Ajouter au panier</button>
            <div className="product-title">Rose éternelle</div>
            <div className="product-price">18.00€</div>
          </div>
          <div className="product-card">
            <div className="promo-label">EN PROMO !</div>
            <img src="https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80" alt="Produit 4" className="product-image" />
            <button className="product-btn">+ Ajouter au panier</button>
            <div className="product-title">SOLEA | Pièce unique</div>
            <div className="product-price">
              <span className="old-price">75.00€</span> 65.00€
            </div>
          </div>
        </div>
      </section>

      {/* SECTION À PROPOS DE LA CRÉATRICE */}
      <section className="about-section">
        <div className="about-bg-text">hautes-alpes - aventure -</div>
        <div className="about-content">
          <div className="about-left">
            <h2>À PROPOS DE<br />LA CRÉATRICE</h2>
            <p>
              Je m'appelle <b>Audrey</b>, créatrice passionnée installée dans les Hautes-Alpes. Curieuse et toujours en quête de nouvelles idées, j'explore sans cesse différentes techniques et styles au crochet. Chaque pièce que je réalise reflète cette envie d'expérimentation et de créativité.
            </p>
            <p>
              Je réalise également de la gravure (sur bois essentiellement, mais pas que !) ou du flocage pour personnaliser toute sorte d'objets et éléments de décoration.
            </p>
            <p>
              Pour moi, <b>chaque création est une aventure qui allie savoir-faire artisanal, inspiration locale et connexion intérieure.</b> C'est cette approche inspirée de la montagne que je souhaite partager à travers mon univers.
            </p>
            <button className="about-btn">En savoir plus</button>
          </div>
          <div className="about-right">
            <div className="about-img-main">
              <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Créations" />
            </div>
            <div className="about-img-portrait">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Portrait créatrice" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION BLOG */}
      <section className="blog-section">
        <h2>
          DÉCOUVRE LE BLOG <span className="blog-heart">❣️</span>
        </h2>
        <div className="blog-list">
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" alt="Blog 1" />
            <div className="blog-overlay"></div>
            <div className="blog-label">Événements</div>
            <div className="blog-title">Mon tout premier marché artisanal : retour sur l'expérience</div>
            <div className="blog-date"><span className="blog-date-icon">📅</span> 08/06/2025</div>
          </div>
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Blog 2" />
            <div className="blog-overlay"></div>
            <div className="blog-label">Matériel</div>
            <div className="blog-title">Addi King Size vs Sentro 48 : quelle machine choisir pour tes projets créatifs ?</div>
            <div className="blog-date"><span className="blog-date-icon">📅</span> 04/04/2025</div>
          </div>
          <div className="blog-card">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Blog 3" />
            <div className="blog-overlay"></div>
            <div className="blog-label">Infos</div>
            <div className="blog-title">Quelle laine choisir ? (Guide Complet 2025)</div>
            <div className="blog-date"><span className="blog-date-icon">📅</span> 12/03/2025</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-help">
            <h3>Besoin d'aide ?</h3>
            <ul>
              <li>Points de vente physiques</li>
              <li>Livraison</li>
              <li>Foire aux questions</li>
              <li>Me contacter</li>
            </ul>
          </div>
          <div className="footer-logo">
            <img src="https://audelweiss.fr/wp-content/uploads/2025/02/logo-blanc.svg" alt="Logo Audelweiss" style={{ width: '180px', height: 'auto' }} />
            <p>
              Chaque pièce est imaginée et réalisée à la main dans les Hautes-Alpes, avec passion et créativité. Un mélange d'authenticité, d'expérimentation et d'énergie positive pour apporter douceur et harmonie à votre quotidien.
              <br /><br />
              Retrouvez-moi sur Instagram pour suivre les actus 🐚✨
            </p>
            <div className="footer-socials">
              <span className="footer-social-icon">IG</span>
              <span className="footer-social-icon">TikTok</span>
            </div>
          </div>
          <div className="footer-links">
            <h3>Liens utiles</h3>
            <ul>
              <li>CGV</li>
              <li>Mentions légales</li>
              <li>Politique de confidentialité</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          2025 © AUDELWEISS Craft – Site réalisé par <a href="#">Audrey HOSSEPIAN</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;