import React, { useEffect, useState } from "react";
import "./BlogPage.css";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/articles?populate=*");
        const data = await response.json();
        console.log("Données reçues depuis Strapi :", data);

        if (data && data.data) {
          setBlogPosts(data.data);
        } else {
          console.error("Format inattendu :", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) return <div>Chargement des articles...</div>;

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <div className="blog-page">
      <h1 className="blog-header-title">BLOG</h1>
      <p className="blog-header-subtitle">Actualités ou simplement informations complémentaires à mes créations</p>

      <div className="blog-posts-container">
        {blogPosts.map((post, index) => {
          console.log("Structure de l'article :", post); // Debug pour voir la structure
          const {
            id,
            title,
            description,
            category,
            date,
            readingTime,
            image,
            Content
          } = post;

          // récupère l'URL de la première image si elle existe
          const imageUrl = image && image.length > 0 ? image[0].url : null;

          return (
            <div key={id} className={`blog-post ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="blog-post-content">
                <span className="blog-post-category">{category}</span>
                <h2>{title}</h2>
                <div className="blog-post-meta">
                  {new Date(date).toLocaleDateString("fr-FR")} • {readingTime}
                </div>
                <p>{description}</p>
                <a 
                  href="#" 
                  className="read-more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReadMore(post);
                  }}
                >
                  Lire la suite →
                </a>
              </div>
              
              <div className="blog-post-image-container">
                {imageUrl ? (
                  <img
                    src={`http://localhost:1337${imageUrl}`}
                    alt={title}
                  />
                ) : (
                  <div style={{ 
                    width: "100%", 
                    height: "300px", 
                    background: "#eee", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "#999",
                    borderRadius: "8px"
                  }}>
                    Pas d'image
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal pour afficher l'article complet */}
      {showModal && selectedPost && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <span className="blog-post-category">{selectedPost.category}</span>
              <h1>{selectedPost.title}</h1>
              <div className="blog-post-meta">
                {new Date(selectedPost.date).toLocaleDateString("fr-FR")} • {selectedPost.readingTime}
              </div>
            </div>
            
            {selectedPost.image && selectedPost.image.length > 0 && (
              <img
                src={`http://localhost:1337${selectedPost.image[0].url}`}
                alt={selectedPost.title}
                className="modal-image"
              />
            )}
            
            <div className="modal-body">
              <div className="modal-description">
                {selectedPost.description}
              </div>
              
              {selectedPost.Content ? (
                <>
                  <div className="modal-content-divider"></div>
                  <div 
                    className="modal-content-text"
                    style={{ 
                      whiteSpace: 'pre-line',
                      lineHeight: '1.8',
                      fontSize: '1.1rem',
                      color: '#2c2c2c'
                    }}
                  >
                    {selectedPost.Content}
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-content-divider"></div>
                  <p style={{ fontStyle: 'italic', color: '#999', textAlign: 'center', padding: '20px' }}>
                    Contenu non disponible pour cet article.
                  </p>
                  <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                    <strong>Debug - Données de l'article :</strong>
                    <pre style={{ fontSize: '12px', marginTop: '10px', overflow: 'auto' }}>
                      {JSON.stringify(selectedPost, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
