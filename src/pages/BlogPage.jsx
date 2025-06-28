import React, { useEffect, useState } from "react";
import "./BlogPage.css";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="blog-page">
      <h1>BLOG</h1>
      <p>Actualités ou simplement informations complémentaires à mes créations</p>

      <div className="blog-posts">
        {blogPosts.map((post) => {
          const {
            id,
            title,
            description,
            category,
            date,
            readingTime,
            image
          } = post;

          // récupère l'URL de la première image si elle existe
          const imageUrl = image && image.length > 0 ? image[0].url : null;

          return (
            <div key={id} className="blog-post">
              {imageUrl ? (
                <img
                  src={`http://localhost:1337${imageUrl}`}
                  alt={title}
                  style={{ width: "300px", height: "auto" }}
                />
              ) : (
                <div style={{ width: "300px", height: "200px", background: "#eee", textAlign: "center", lineHeight: "200px" }}>
                  Pas d'image
                </div>
              )}
              <h2>{title}</h2>
              <p>{description}</p>
              <p><strong>Catégorie :</strong> {category}</p>
              <p><strong>Date :</strong> {new Date(date).toLocaleDateString("fr-FR")}</p>
              <p><strong>Temps de lecture :</strong> {readingTime}</p>
              <a href="#">Lire la suite →</a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPage;
