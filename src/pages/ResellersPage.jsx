import React, { useEffect, useState } from "react";
import "./ResellersPage.css";

function ResellersPage() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/resellers?populate=*");
        const data = await response.json();
        console.log("Données reçues depuis Strapi :", data.data);
        if (data && data.data) {
          // extraction propre des attributs
          const cleanedData = data.data.map((item) => ({
            id: item.id,
            ...item,
          }));
          setResellers(cleanedData);
        } else {
          console.error("Format inattendu :", data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des revendeurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResellers();
  }, []);

  if (loading) return <div>Chargement des points de vente...</div>;

  return (
    <div className="resellers-container" style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Où retrouver mes créations 🪡
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        {resellers.map((item) => {
          const {
            id,
            name = "Nom non disponible",
            adress = "Non disponible",
            description = "Description non disponible",
            products = "Non spécifié",
            image,
          } = item;

          let imageUrl = null;
          if (
            image &&
            Array.isArray(image) &&
            image.length > 0 &&
            image[0].url
          ) {
            imageUrl = `http://localhost:1337${image[0].url}`;
          }

          return (
            <div
              key={id}
              style={{
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "#eee",
                    color: "#999",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  Pas d'image
                </div>
              )}

              <h2 style={{ fontSize: "1.2rem", fontWeight: "600", margin: "10px 0" }}>{name}</h2>
              <p><strong>📍 Adresse :</strong> {adress}</p>
              <p style={{ fontSize: "0.95rem", margin: "10px 0" }}>{description}</p>
              <p><strong>🍩 Ce que tu peux y trouver :</strong> {products}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResellersPage;
