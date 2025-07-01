import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import ShopPage from './pages/ShopPage';
import BlogPage from './pages/BlogPage'; // Import du composant BlogPage
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage'; // Import du composant ProfilePage
import OrdersPage from './pages/OrdersPage'; // Import du composant OrdersPage
import ErrorBoundary from './components/ErrorBoundary'; // Import du composant ErrorBoundary
import Navbar from './components/Navbar'; // Import du composant Navbar
import Footer from './components/Footer'; // Import du composant Footer
import CreationsPage from './pages/CreationsPage'; // Import corrigé du composant CreationsPage
import Contact from './pages/Contact'; // Import du composant Contact

// Fonction pour récupérer les informations utilisateur depuis l'API avec le rôle
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
    console.log('Réponse de l\'API /api/users/me?populate=role :', data); // Log du JSON
    return data.role?.type; // Retourne le type du rôle utilisateur
  } catch (err) {
    console.error('Erreur lors de la récupération des informations utilisateur', err);
    return null;
  }
};

// Fonction pour vérifier si l'utilisateur est authentifié et a le rôle requis
const isAuthenticated = async (requiredRoleType) => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return false;

  try {
    const payload = JSON.parse(atob(jwt.split('.')[1])); // Décoder le JWT
    let userRoleType = payload.role;

    if (!userRoleType) {
      console.log('Rôle absent du JWT, récupération via API...');
      userRoleType = await fetchUserRole(); // Récupère le rôle via l'API /users/me?populate=role
    }

    console.log('Rôle requis (type) :', requiredRoleType, 'Rôle utilisateur (type) :', userRoleType);
    return requiredRoleType ? userRoleType === requiredRoleType : true;
  } catch (err) {
    console.error('Erreur lors du décodage du JWT ou de la récupération du rôle', err);
    return false;
  }
};

// Composant pour protéger les routes
const ProtectedRoute = ({ children, requiredRoleType }) => {
  const [isAuthorized, setIsAuthorized] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authorized = await isAuthenticated(requiredRoleType);
        setIsAuthorized(authorized);
      } catch (err) {
        console.error('Erreur dans ProtectedRoute :', err);
        setError(err);
      }
    };
    checkAuth();
  }, [requiredRoleType]);

  if (error) {
    return (
      <div className="error-message">
        Une erreur est survenue lors de la vérification des autorisations.
      </div>
    );
  }

  if (isAuthorized === null) {
    return <div>Chargement...</div>; // Affiche un état de chargement
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

// Composant pour afficher la Navbar conditionnellement
function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarPaths = ['/login']; // Liste des chemins où la Navbar doit être masquée

  if (hideNavbarPaths.includes(location.pathname)) {
    return null; // Ne pas afficher la Navbar
  }

  return <Navbar />; // Affiche la Navbar
}

// Composant pour remonter en haut de page lors du changement de route
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Composant principal
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ConditionalNavbar /> {/* Affiche la Navbar conditionnellement */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/blog" element={<BlogPage />} /> {/* Route pour la page de blog */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/creations" element={<CreationsPage />} /> {/* Route corrigée pour la page Créations */}
          <Route path="/contact" element={<Contact />} /> {/* Route pour la page Contact */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Route pour la page Profil */}
          <Route path="/orders" element={<OrdersPage />} /> {/* Route pour la page Commandes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoleType="admin_site">
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer /> {/* Footer global pour toutes les pages */}
      </Router>
    </ErrorBoundary>
  );
}