import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

    // Gérer le scroll pour l'effet glassmorphism
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setShowLogoutMenu(false);
    navigate('/');
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="https://audelweiss.fr/wp-content/uploads/2025/02/logo-wide.svg" alt="Logo Audelweiss" style={{ width: '170px', height: 'auto', verticalAlign: 'middle' }} />
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            🏠 Accueil
          </Link>
          <Link 
            to="/shop" 
            className={`special ${isActive('/shop') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            🛍️ Boutique
          </Link>
          <Link 
            to="/blog" 
            className={isActive('/blog') ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            📝 Blog
          </Link>
          <Link 
            to="/creations" 
            className={isActive('/creations') ? 'active' : ''}
            onClick={closeMobileMenu}
          >
            🎨 Créations
          </Link>
          <a href="#" onClick={closeMobileMenu}>
            📞 Contact
          </a>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`special ${isActive('/admin') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              ⚙️ Admin
            </Link>
          )}
        </div>

        <div className="navbar-user-section">
          {isLoggedIn ? (
            <div className="user-menu-wrapper">
              <button
                className="user-avatar-button"
                onClick={() => setShowLogoutMenu(prev => !prev)}
                title="Mon compte"
              >
                👤
              </button>
              
              {showLogoutMenu && (
                <div className="user-dropdown">
                  <button className="dropdown-item">
                    👤 Mon Profil
                  </button>
                  <button className="dropdown-item">
                    📦 Mes Commandes
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              🔐 Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
