import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import referralService from "../services/referralService";
import "./LoginPage.css";

export default function LoginPage() {
  console.log('🚀 LoginPage: Composant rendu');
  
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    username: "",
    referralCode: ""
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1); // 1: signup, 2: referral processing
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch user info if JWT exists on mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetchUser(jwt);
    }
  }, []);

  const fetchUser = async (jwt) => {
    try {
      const res = await fetch("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const userData = await res.json();
      setUser(userData);
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem("jwt");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ LoginPage: Changement ${name}:`, value);
    
    setFormData({ ...formData, [name]: value });
    if (error) setError(null); // Effacer les erreurs lors de la saisie
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 LoginPage: Soumission du formulaire');
    console.log('📝 LoginPage: Mode:', isRegister ? 'Inscription' : 'Connexion');
    console.log('📝 LoginPage: Données du formulaire:', formData);
    
    setError(null);

    if (isRegister) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    console.log('🔐 LoginPage: Début connexion');
    
    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();
      console.log('🔐 LoginPage: Réponse connexion:', data);

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        console.log('✅ LoginPage: Connexion réussie, redirection vers la landing page');
        navigate("/"); // Redirection vers la landing page
      } else {
        console.error('❌ LoginPage: Erreur connexion:', data);
        setError(data.error?.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error('❌ LoginPage: Erreur réseau connexion:', err);
      setError("Impossible de se connecter au serveur.");
    }
  };

  const handleRegister = async () => {
    console.log('📝 LoginPage: Début inscription');
    
    try {
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();
      console.log('📝 LoginPage: Réponse inscription:', data);

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        setRegistrationSuccess(true);
        
        // Si un code de parrainage est fourni, l'utiliser
        if (formData.referralCode.trim()) {
          console.log('🎫 LoginPage: Code de parrainage fourni, passage à l\'étape 2');
          setRegistrationStep(2);
          await processReferralCode();
        } else {
          console.log('🎉 LoginPage: Inscription terminée sans parrainage, redirection vers landing');
          setTimeout(() => {
            navigate("/"); // Redirection vers la landing page
          }, 2000);
        }
      } else {
        console.error('❌ LoginPage: Erreur inscription:', data);
        setError(data.error?.message || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error('❌ LoginPage: Erreur réseau inscription:', err);
      setError("Impossible de se connecter au serveur.");
    }
  };

  const processReferralCode = async () => {
    console.log('🎫 LoginPage: Début traitement code de parrainage');
    console.log('🎫 LoginPage: Code à traiter:', formData.referralCode);
    
    try {
      const referralResult = await referralService.useReferralCode(formData.referralCode);
      console.log('✅ LoginPage: Code de parrainage appliqué:', referralResult);
      
      setError(null);
      setTimeout(() => {
        console.log('🎉 LoginPage: Inscription et parrainage terminés, redirection vers landing');
        navigate("/"); // Redirection vers la landing page
      }, 3000);
      
    } catch (err) {
      console.error('❌ LoginPage: Erreur code de parrainage:', err);
      
      // Gestion spécifique des erreurs de parrainage
      let errorMessage = '';
      if (err.message.includes('unique')) {
        errorMessage = 'Vous avez déjà été parrainé ou ce code a déjà été utilisé.';
      } else if (err.message.includes('invalide')) {
        errorMessage = 'Code de parrainage invalide ou expiré.';
      } else if (err.message.includes('vous ne pouvez pas')) {
        errorMessage = 'Vous ne pouvez pas utiliser votre propre code de parrainage.';
      } else {
        errorMessage = `Erreur avec le code de parrainage: ${err.message}`;
      }
      
      setError(`✅ Compte créé avec succès ! ⚠️ ${errorMessage}`);
      
      setTimeout(() => {
        console.log('⚠️ LoginPage: Inscription OK, parrainage échoué, redirection vers landing');
        navigate("/"); // Redirection vers la landing page
      }, 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setFormData({ email: "", password: "", username: "" });
    setIsRegister(false);
    setError(null);
    // Optionally navigate to login page:
    // navigate("/login");
  };

  if (user) {
    return (
      <div className="login-root">
        <div className="login-container">
          <h1>Bienvenue, {user.username || user.email} !</h1>
          <p>Email: {user.email}</p>
          <button className="login-btn" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // Écran de traitement du parrainage
  if (registrationStep === 2) {
    console.log('⏳ LoginPage: Affichage étape 2 - traitement parrainage');
    return (
      <div className="login-root">
        <div className="login-container">
          <h1>🎉 Inscription réussie !</h1>
          <div className="referral-processing">
            <h3>🎫 Traitement du code de parrainage...</h3>
            <p>Code utilisé: <strong>{formData.referralCode}</strong></p>
            <div className="loading-spinner">⏳</div>
            {error && (
              <div className="login-error" style={{ marginTop: '1rem' }}>
                {error}
              </div>
            )}
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
              Redirection automatique vers la boutique...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Écran de succès d'inscription
  if (registrationSuccess && registrationStep === 1) {
    console.log('🎉 LoginPage: Affichage succès inscription');
    return (
      <div className="login-root">
        <div className="login-container">
          <h1>🎉 Inscription réussie !</h1>
          <p>Votre compte a été créé avec succès.</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Redirection automatique vers la boutique...
          </p>
          <div className="loading-spinner">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root">
      <div className="login-container">
        <h1>{isRegister ? "Créer un compte" : "Connexion"}</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="login-field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {/* Champ code de parrainage pour l'inscription */}
          {isRegister && (
            <div className="login-field referral-field">
              <label htmlFor="referralCode">
                🎫 Code de parrainage (optionnel)
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                placeholder="Entrez le code d'un ami"
                style={{ textTransform: 'uppercase' }}
              />
              <small className="referral-help">
                💡 Gagnez des récompenses en utilisant le code d'un ami !
              </small>
            </div>
          )}
          
          <button type="submit" className="login-btn">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
        <p className="login-toggle">
          {isRegister ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}{" "}
          <button type="button" onClick={() => {
            console.log('🔄 LoginPage: Basculement de mode');
            setIsRegister(!isRegister);
            setFormData({ email: "", password: "", username: "", referralCode: "" });
            setError(null);
          }}>
            {isRegister ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
}
