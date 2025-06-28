import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Fonction pour récupérer le rôle utilisateur
const fetchUserRole = async () => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return null;

  try {
    const response = await fetch('http://localhost:1337/api/users/me?populate=role', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.role?.type; // Retourne le type du rôle utilisateur
  } catch (err) {
    console.error('Erreur lors de la récupération des informations utilisateur', err);
    return null;
  }
};

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const jwt = localStorage.getItem('jwt');
      setIsLoggedIn(!!jwt);

      if (jwt) {
        const role = await fetchUserRole();
        setIsAdmin(role === "admin_site");
      }
    };
    checkAuthAndRole();
  }, []);

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setShowLogoutMenu(false);
    navigate('/'); // Redirige vers l'accueil après déconnexion
  }

  return (
    <header className="landing-header">
      <nav className="landing-nav">
        <div className="landing-logo">Artisan Créations</div>
        <div className="landing-links">
          <Link to="/">Accueil</Link>
          <Link to="/shop" style={{ color: "#d4a574" }}>Boutique</Link>
          <Link to="/blog">Blog</Link>
          <a href="#">Créations</a>
          <a href="#">Sur-mesure</a>
          <a href="#">Contact</a>
          <Link to="/cart" style={{ color: "#d4a574" }}>Panier</Link>
          {isAdmin && <Link to="/admin" style={{ color: "#d4a574" }}>Admin</Link>}

          {isLoggedIn && (
            <div style={{ position: "relative", display: "inline-block", marginLeft: "10px" }}>
              <button
                onClick={() => setShowLogoutMenu(prev => !prev)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
                title="Mon compte"
              >
                👤
              </button>
              {showLogoutMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#333",
                      fontSize: "1rem",
                    }}
                  >
                    Déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
