import React, { useEffect, useState } from "react";
import "./CreationsPage.css";

// Fonction pour récupérer les créations depuis Strapi
const fetchCreations = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/creations?populate=img');
    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Réponse inattendue de Strapi:", data);
      return [];
    }

    return data.data.map((item) => {
      // Dans Strapi v5, les données sont directement sur l'item, pas dans attributes
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

export default function CreationsPage() {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCreations = async () => {
      setLoading(true);
      const fetchedCreations = await fetchCreations();
      setCreations(fetchedCreations);
      setLoading(false);
    };
    loadCreations();
  }, []);

  const filteredCreations = creations.filter((creation) => {
    if (!creation) return false;
    const titre = creation.titre || "";
    const descriptions = creation.descriptions || "";
    const searchTerm = search.toLowerCase();
    
    return titre.toLowerCase().includes(searchTerm) ||
           descriptions.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="creations-root">
      <header className="creations-header">
        <div className="main-container">
          <h1>Nos Créations</h1>
          <p>Découvrez notre galerie de créations artisanales uniques, façonnées avec passion et savoir-faire.</p>
        </div>
      </header>
      
      <main className="creations-main main-container">
        <div className="creations-search-section">
          <form className="creations-search-box" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Rechercher dans nos créations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="creations-search-icon">🔍</span>
          </form>
        </div>

        <section className="creations-gallery">
          {loading ? (
            <div className="creations-loading">Chargement des créations...</div>
          ) : filteredCreations.length === 0 ? (
            <div className="creations-loading">Aucune création trouvée.</div>
          ) : (
            <div className="creations-grid">
              {filteredCreations.map((creation) => (
                <div key={creation.id} className="creation-card">
                  <div className="creation-img-wrap">
                    {creation.img ? (
                      <img src={creation.img} alt={creation.titre} />
                    ) : (
                      <div className="creation-img-placeholder">
                        <span>🎨</span>
                      </div>
                    )}
                  </div>
                  <div className="creation-content">
                    <h3 className="creation-title">{creation.titre}</h3>
                    <p className="creation-description">{creation.descriptions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-container">
          <p className="landing-footer-links">
            <a href="#">Mentions légales</a> | <a href="#">CGV</a> | <a href="#">Contact</a>
          </p>
          <p>© 2025 Artisan Créations - Fait main avec passion dans les Hautes-Alpes</p>
        </div>
      </footer>
    </div>
  );
}
