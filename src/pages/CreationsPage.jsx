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
        longDescription: item.LongDescription || "",
        time: item.Temps || "",
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
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (creation) => {
    setSelectedCreation(creation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCreation(null);
  };

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
                <div 
                  key={creation.id} 
                  className="creation-card"
                  onClick={() => openModal(creation)}
                >
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

      {/* Modal Popup */}
      {isModalOpen && selectedCreation && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            
            <div className="modal-header">
              <h2>{selectedCreation.titre}</h2>
            </div>
            
            <div className="modal-body">
              <div className="modal-image">
                {selectedCreation.img ? (
                  <img src={selectedCreation.img} alt={selectedCreation.titre} />
                ) : (
                  <div className="modal-img-placeholder">
                    <span>🎨</span>
                  </div>
                )}
              </div>
              
              <div className="modal-details">
                <div className="modal-info-section">
                  <h3>Catégorie(s)</h3>
                  <p>{selectedCreation.descriptions}</p>
                </div>
                
                {selectedCreation.longDescription && (
                  <div className="modal-info-section">
                    <h3>Description détaillée</h3>
                    <p>{selectedCreation.longDescription}</p>
                  </div>
                )}
                
                {selectedCreation.time && (
                  <div className="modal-info-section">
                    <h3>Temps de création</h3>
                    <p className="creation-time">
                      <span className="time-icon">⏱️</span>
                      {selectedCreation.time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}
