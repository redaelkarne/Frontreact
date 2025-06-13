import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isRegister
      ? "http://localhost:1337/api/auth/local/register"
      : "http://localhost:1337/api/auth/local";

    const body = isRegister
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { identifier: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt); // Stocker le token JWT
        navigate("/shop"); // Rediriger vers la boutique
      } else {
        setError(data.error?.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur.");
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
          <button type="submit" className="login-btn">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
        <p className="login-toggle">
          {isRegister ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}{" "}
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
}
