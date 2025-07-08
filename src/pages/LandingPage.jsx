import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const animatedWords = [
  "uniques",
  "faites-main",
  "douces",
  "colorées",
  "sur mesure"
];

// Fonction pour récupérer les produits depuis Strapi
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/featured-products?populate=img');
    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Réponse inattendue de Strapi:", data);
      return [];
    }

    return data.data.map((item) => {
      const attributes = item.attributes || {};
      return {
        id: item.id,
        name: attributes.Name || item.Name,
        price: attributes.price || item.price,
        originalPrice: attributes.originalPrice || item.originalPrice,
        promo: attributes.promo || item.promo,
        img: attributes.img?.data?.attributes?.url
          ? `http://localhost:1337${attributes.img.data.attributes.url}`
          : `http://localhost:1337${item.img?.url || ""}`,
        categorie: attributes.Categorie || item.Categorie || "Autre",
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    return [];
  }
};

// Fonction pour récupérer les articles de blog depuis Strapi
const fetchBlogArticles = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/articles?populate=image&sort=createdAt:desc&pagination[limit]=3');
    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Réponse inattendue de Strapi:", data);
      return [];
    }

    return data.data.map((item) => {
      const attributes = item.attributes || {};
      return {
        id: item.id,
        title: attributes.title || item.title,
        excerpt: attributes.excerpt || item.excerpt,
        category: attributes.category || item.category || "Blog",
        createdAt: attributes.createdAt || item.createdAt,
        img: attributes.image?.data?.attributes?.url
          ? `http://localhost:1337${attributes.image.data.attributes.url}`
          : null,
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des articles:", err);
    return [];
  }
};

// Fonction pour récupérer les créations depuis Strapi
const fetchCreations = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/creations?populate=img&pagination[limit]=3');
    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      return [];
    }

    return data.data.map((item) => {
      return {
        id: item.id,
        titre: item.Titre || "",
        descriptions: item.description || "",
        img: item.img?.url
          ? `http://localhost:1337${item.img.url}`
          : null,
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des créations:", err);
    return [];
  }
};

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [products, setProducts] = useState([]);
  const [blogArticles, setBlogArticles] = useState([]);
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Catégories avec liens vers la boutique avec filtres
  const categories = [
    {
      name: "Bandeaux",
      img: creations[0]?.img || "https://audelweiss.fr/wp-content/uploads/2025/02/bandeaufantaisie.jpg.webp",
      link: "/shop?category=Bandeaux"
    },
    {
      name: "Fleurs",
      img: creations[1]?.img || "https://audelweiss.fr/wp-content/smush-webp/2025/04/Illustration_sans_titre-1.png.webp",
      link: "/shop?category=Fleurs"
    },
    {
      name: "Porte-clé",
      img: creations[2]?.img || "https://audelweiss.fr/wp-content/uploads/2025/02/porte-cle.jpg.webp",
      link: "/shop?category=Porte-clé"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % animatedWords.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [fetchedProducts, fetchedArticles, fetchedCreations] = await Promise.all([
        fetchProducts(),
        fetchBlogArticles(),
        fetchCreations()
      ]);
      
      setProducts(fetchedProducts);
      setBlogArticles(fetchedArticles);
      setCreations(fetchedCreations);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    // La navigation sera gérée par le Link de React Router
  };

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
          <Link to="/shop" onClick={() => handleNavigation('/shop')}>
            <button className="hero-btn">Découvrir la boutique</button>
          </Link>
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

      {/* BANDEAU CRÉATIONS */}
      <section className="categories-banner">
        <div className="categories-banner-top">
          <span>• NOS CRÉATIONS • • • NOS CRÉATIONS • • • NOS CRÉATIONS • • • NOS CRÉATIONS •</span>
        </div>
        <div className="categories-banner-content">
          <div className="categories-left">
            {creations.length > 0 ? (
              <img
                src={creations[hovered]?.img || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"}
                alt={creations[hovered]?.titre || "Création"}
                style={{ width: 280, height: 280, borderRadius: 18, objectFit: "cover", boxShadow: "0 2px 12px #e0d6d0" }}
              />
            ) : (
              <div style={{ width: 280, height: 280, borderRadius: 18, background: "#f8f6f3", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px #e0d6d0" }}>
                <span style={{ fontSize: "2.5rem", color: "#d4a574" }}>🎨</span>
              </div>
            )}
          </div>
          <div className="categories-center">
            <h2>
              {loading ? (
                <div style={{ color: "#666", fontSize: "1.1rem" }}>Chargement des créations...</div>
              ) : creations.length === 0 ? (
                <div style={{ color: "#666", fontSize: "1.1rem" }}>Aucune création disponible</div>
              ) : (
                creations.map((creation, idx) => (
                  <Link
                    key={creation.id}
                    to="/creations"
                    style={{
                      display: "block",
                      color: hovered === idx ? "#f47b9b" : "#3a3937",
                      fontWeight: hovered === idx ? "bold" : "normal",
                      textDecoration: "none",
                      fontSize: "1.8rem",
                      margin: "8px 0",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(hovered)}
                  >
                    {creation.titre}
                  </Link>
                ))
              )}
            </h2>
            <Link to="/creations" onClick={() => handleNavigation('/creations')}>
              <button className="boutique-btn">Voir toutes nos créations</button>
            </Link>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>
              Chargement des produits...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>
              Aucun produit disponible
            </div>
          ) : (
            products.slice(0, 4).map((product) => (
              <div key={product.id} className="product-card">
                {product.promo && <div className="promo-label">EN PROMO !</div>}
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                <Link to="/shop">
                  <button className="product-btn"> Voir plus en boutique</button>
                </Link>
                <div className="product-rating">★★★★★</div>
                <div className="product-title">{product.name}</div>
                <div className="product-price">
                  {product.originalPrice && (
                    <span className="old-price">{product.originalPrice}€</span>
                  )}
                  {product.price}€
                </div>
              </div>
            ))
          )}
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
            <Link to="/creations" onClick={() => handleNavigation('/creations')}>
              <button className="about-btn">En savoir plus</button>
            </Link>
          </div>
          <div className="about-right">
            <div className="about-img-main">
              <img src="https://audelweiss.fr/wp-content/uploads/2025/02/bandeaux.jpg.webp" alt="Créations" />
            </div>
            <div className="about-img-portrait">
              <img src="https://audelweiss.fr/wp-content/uploads/2025/02/4b016c7372b5440180c5e265eed458d1-scaled.webp" alt="Portrait créatrice" />
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>
              Chargement des articles...
            </div>
          ) : blogArticles.length === 0 ? (
            // Articles statiques si pas d'articles dans Strapi
            <>
              <Link to="/blog" className="blog-card">
                <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" alt="Blog 1" />
                <div className="blog-overlay"></div>
                <div className="blog-label">Événements</div>
                <div className="blog-title">Mon tout premier marché artisanal : retour sur l'expérience</div>
                <div className="blog-date"><span className="blog-date-icon">📅</span> 08/06/2025</div>
              </Link>
              <Link to="/blog" className="blog-card">
                <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" alt="Blog 2" />
                <div className="blog-overlay"></div>
                <div className="blog-label">Matériel</div>
                <div className="blog-title">Addi King Size vs Sentro 48 : quelle machine choisir pour tes projets créatifs ?</div>
                <div className="blog-date"><span className="blog-date-icon">📅</span> 04/04/2025</div>
              </Link>
              <Link to="/blog" className="blog-card">
                <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Blog 3" />
                <div className="blog-overlay"></div>
                <div className="blog-label">Infos</div>
                <div className="blog-title">Quelle laine choisir ? (Guide Complet 2025)</div>
                <div className="blog-date"><span className="blog-date-icon">📅</span> 12/03/2025</div>
              </Link>
            </>
          ) : (
            blogArticles.map((article) => (
              <Link key={article.id} to="/blog" className="blog-card">
                <img 
                  src={article.img || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"} 
                  alt={article.title} 
                />
                <div className="blog-overlay"></div>
                <div className="blog-label">{article.category}</div>
                <div className="blog-title">{article.title}</div>
                <div className="blog-date">
                  <span className="blog-date-icon">📅</span> {formatDate(article.createdAt)}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;