import React, { useState, useEffect, useRef } from "react";
import "./LandingPage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { featuredProducts, blogs } from "./mockData";
import { Link } from "react-router-dom";

const galleryImages = [
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1594736797933-d0c4e9c6d9a0?auto=format&fit=crop&w=400&q=80"
];

const RatingStars = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        style={{
          color: star <= rating ? '#ff6b9d' : '#e0e0e0',
          fontSize: '12px'
        }}
      >
        ★
      </span>
    ))}
  </div>
);

function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return [ref, visible];
}

function GallerySlider({ images }) {
  const settings = {
    className: "gallery-slick-slider",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    speed: 600,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 2600,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 }
      }
    ]
  };
  return (
    <div className="gallery-slider-3d">
      <Slider {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="gallery-slide-3d">
            <img src={img} alt={`Création artisanale ${idx + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function ProductsSlider({ products }) {
  const settings = {
    className: "products-slick-slider",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    speed: 600,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 }
      }
    ]
  };
  return (
    <div className="products-slider-3d">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="products-slide-3d">
            <div className="landing-product-card hovered">
              {product.promo && (
                <div className="landing-product-promo">EN PROMO !</div>
              )}
              <div className="landing-product-img-wrapper">
                <img src={product.img} alt={product.name} className="landing-product-img" />
              </div>
              <div className="landing-product-content">
                {product.rating > 0 && <RatingStars rating={product.rating} />}
                <h3 className="landing-product-title">{product.name}</h3>
                <div className="landing-product-price-row">
                  <span className="landing-product-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="landing-product-original-price">{product.originalPrice}</span>
                  )}
                </div>
                <button className={`landing-product-btn${product.id <= 2 ? " dark" : ""}`}>
                  {product.id <= 2 ? <>⚙ Choix des options</> : <>🛒 Ajouter au panier</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default function FrenchArtisanLanding() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState(null);
  const [blogPosts, setBlogPosts] = useState(null);

  // Simuler la récupération des produits et blogs
  useEffect(() => {
    setTimeout(() => setProducts(featuredProducts), 500);
    setTimeout(() => setBlogPosts(blogs), 700);
  }, []);

  // Fade-in hooks
  const [productsRef, productsVisible] = useFadeIn(200);
  const [blogRef, blogVisible] = useFadeIn(400);

  return (
    <div className="landing-root">
      {/* Animated Banner */}
      <div className="banner-scroll">
        <div className="banner-scroll-content">
          <div className="banner-scroll-items">
            <span className="banner-item">✨ Livraison gratuite dès 50€ d'achat</span>
            <span className="banner-item">🎁 Personnalisation sur-mesure disponible</span>
            <span className="banner-item">🌿 Matériaux écologiques et durables</span>
            <span className="banner-item">💝 Emballage cadeau offert</span>
          </div>
          <div className="banner-scroll-items">
            <span className="banner-item">✨ Livraison gratuite dès 50€ d'achat</span>
            <span className="banner-item">🎁 Personnalisation sur-mesure disponible</span>
            <span className="banner-item">🌿 Matériaux écologiques et durables</span>
            <span className="banner-item">💝 Emballage cadeau offert</span>
          </div>
        </div>
      </div>

  
      {/* Hero Section with Background Image */}
      <section className="landing-hero">
        <div className="landing-hero-overlay"></div>
        <div className="landing-hero-content">
          <div style={{ maxWidth: "600px" }}>
            <h1 className="landing-hero-title">
              Des créations<br />
              <span className="landing-hero-title-em">douces</span><br />
              crochetées et<br />
              gravées
            </h1>
            <p className="landing-hero-desc">
              Chaque pièce est soigneusement confectionnée à la main dans les Hautes-Alpes.
              Offre-toi (ou à tes proches) un savoir-faire inspiré de la montagne, alliant douceur et originalité.
            </p>
            <button
              className="landing-hero-btn animated-btn"
              onMouseEnter={e => e.currentTarget.classList.add("hover")}
              onMouseLeave={e => e.currentTarget.classList.remove("hover")}
            >
              Découvrir la boutique
            </button>
          </div>
        </div>
        <div className="landing-hero-badge">
          <div style={{ textAlign: "center" }}>
            <div className="landing-hero-badge-top">FAIT AVEC</div>
            <div className="landing-hero-badge-heart">❤️ amour</div>
            <div className="landing-hero-badge-bottom">HAUTES-ALPES</div>
          </div>
        </div>
      </section>

      {/* Three Columns Section */}
      <section className="landing-columns">
        <div className="landing-columns-grid">
          {/* Column 1 - Artisan */}
          <div>
            <div className="landing-column-number">01</div>
            <h3 className="landing-column-title">ARTISANAT EMBRUNAIS</h3>
            <p className="landing-column-desc">
              Je vis dans les Hautes-Alpes, un cadre qui m'inspire chaque jour. Toutes mes créations
              sont réalisées ici, à la main, avec des matériaux choisis avec soin. J'aime l'idée de
              proposer des pièces qui portent en elles un peu de cette authenticité montagnarde.
            </p>
          </div>

          {/* Column 2 - Limited Editions */}
          <div>
            <div className="landing-column-number">02</div>
            <h3 className="landing-column-title">ÉDITIONS LIMITÉES<br />OU SUR-MESURE</h3>
            <p className="landing-column-desc">
              Je suis une créatrice curieuse, toujours en quête de nouvelles idées. J'aime tester des
              techniques, des couleurs et des matières différentes. Cette envie d'explorer donne
              naissance à des pièces variées : certaines sont produites en petites séries, d'autres peuvent
              être personnalisées selon vos goûts et vos besoins.
            </p>
          </div>

          {/* Column 3 - Personalization */}
          <div>
            <div className="landing-column-number">03</div>
            <h3 className="landing-column-title">PERSONNALISATION SUR<br />DEMANDE</h3>
            <p className="landing-column-desc">
              Crochet, gravure ou flocage : je réalise des créations personnalisées pour ta décoration ou
              des cadeaux ! Certains produits de la boutique sont personnalisables, mais je peux tout à fait
              personnaliser un objet que tu as déjà en ta possession.
            </p>
            <a href="#" className="landing-column-contact">
              Écris-moi pour en savoir plus ✨
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section - 3D Slider */}
      <section className="landing-gallery-section">
        <GallerySlider images={galleryImages} />
      </section>

      {/* Main CTA Section */}
      <section className="landing-main-cta">
        <h1 className="landing-main-cta-title">
          Des créations <em className="landing-main-cta-em">artisanales</em> uniques
        </h1>
        <p className="landing-main-cta-desc">
          Fait main avec <strong>passion</strong>, pour toi et ceux que tu aimes ✨
        </p>
      </section>

      {/* Products Section - 3D Slider */}
      <section
        className={`landing-products-section fade-in${productsVisible ? " visible" : ""}`}
        ref={productsRef}
      >
        {products ? (
          <ProductsSlider products={products} />
        ) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
            Chargement des produits...
          </div>
        )}
      </section>

      {/* Blog Section - Fade in */}
      <section
        className={`landing-blog-section fade-in${blogVisible ? " visible" : ""}`}
        ref={blogRef}
      >
        <div className="landing-blog-container">
          <div className="landing-blog-header">
            <h2 className="landing-blog-title">
              Le <em className="landing-blog-title-em">journal</em> de l'atelier
            </h2>
            <p className="landing-blog-desc">
              Découvre mes inspirations, mes techniques et l'univers créatif des Hautes-Alpes
            </p>
          </div>
          <div className="landing-blog-grid">
            {!blogPosts && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
                Chargement des articles...
              </div>
            )}
            {blogPosts && blogPosts.map((blog) => (
              <article
                key={blog.id}
                className="landing-blog-card"
                tabIndex={0}
                onMouseEnter={e => { e.currentTarget.classList.add("hovered"); }}
                onMouseLeave={e => { e.currentTarget.classList.remove("hovered"); }}
              >
                <div
                  className="landing-blog-img"
                  style={{
                    backgroundImage: `url('${blog.image}')`
                  }}
                >
                  <div className="landing-blog-date">
                    {blog.date}
                  </div>
                </div>
                <div className="landing-blog-content">
                  <h3 className="landing-blog-card-title">
                    {blog.title}
                  </h3>
                  <p className="landing-blog-card-desc">
                    {blog.excerpt}
                  </p>
                  <div className="landing-blog-card-footer">
                    <span className="landing-blog-card-category">
                      {blog.category}
                    </span>
                    <span className="landing-blog-card-link">
                      Lire l'article →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="landing-blog-footer">
            <button
              className="landing-blog-btn animated-btn"
              onMouseEnter={e => { e.currentTarget.classList.add("hover"); }}
              onMouseLeave={e => { e.currentTarget.classList.remove("hover"); }}
            >
              Voir tous les articles
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <p className="landing-footer-copyright">
            © 2025 Artisan Créations - Fait main avec passion dans les Hautes-Alpes
          </p>
          <div className="landing-footer-links">
            <a href="#">Mentions légales</a>
            <a href="#">CGV</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}