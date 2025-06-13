import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    const checkAdmin = async () => {
      const role = await fetchUserRole();
      setIsAdmin(role === "admin_site"); // Met à jour l'état si l'utilisateur est admin
    };
    checkAdmin();
  }, []);

  return (
    <header className="landing-header">
      <nav className="landing-nav">
        <div className="landing-logo">Artisan Créations</div>
        <div className="landing-links">
          <Link to="/">Accueil</Link>
          <Link to="/shop" style={{ color: "#d4a574" }}>Boutique</Link>
          <a href="#">Créations</a>
          <a href="#">Sur-mesure</a>
          <a href="#">Contact</a>
          <Link to="/cart" style={{ color: "#d4a574" }}>Panier</Link>
          {isAdmin && <Link to="/admin" style={{ color: "#d4a574" }}>Admin</Link>}
        </div>
      </nav>
    </header>
  );
}
