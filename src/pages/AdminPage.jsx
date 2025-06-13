import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./AdminPage.css";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("stats"); // Onglet actif
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", categorie: "", promo: false });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Utilisateur en cours de modification
  const [userForm, setUserForm] = useState({ username: "", email: "", confirmed: false, blocked: false });
  const [notification, setNotification] = useState(null); // État pour la notification

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("http://localhost:1337/api/featured-products")
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur produits: ${res.status}`);
          return res.json();
        }),
      fetch("http://localhost:1337/api/commandes")
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur commandes: ${res.status}`);
          return res.json();
        }),
      fetch("http://localhost:1337/api/users")
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur utilisateurs: ${res.status}`);
          return res.json();
        }),
    ])
      .then(([prodData, orderData, userData]) => {
        setProducts(prodData.data || []);
        setOrders(orderData.data || []);
        setUsers(userData || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000); // Disparaît après 2 secondes
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch("http://localhost:1337/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la demande de réinitialisation : ${response.status}`);
      }

      showNotification(`Un email de réinitialisation a été envoyé à ${email}.`);
    } catch (err) {
      console.error("Erreur lors de la demande de réinitialisation :", err);
      showNotification("Une erreur est survenue lors de la demande de réinitialisation.");
    }
  };

  const updateUser = (userId) => {
    alert(`Modification des informations pour l'utilisateur ID: ${userId}`);
  };

  const handleProductSave = async () => {
    if (editingProduct) {
      // Modification d'un produit existant
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === editingProduct ? { ...p, ...form } : p
        )
      );
      setEditingProduct(null);
      showNotification("Produit modifié avec succès !");
    } else {
      // Ajout d'un nouveau produit
      const newProduct = {
        Name: form.Name.trim(),
        price: parseFloat(form.price) || 0,
        Categorie: form.Categorie.trim(),
        promo: form.promo,
      };

      if (!newProduct.Name || !newProduct.Categorie) {
        showNotification("Veuillez remplir tous les champs obligatoires (Nom et Catégorie).");
        return;
      }

      try {
        const response = await fetch("http://localhost:1337/api/featured-products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: newProduct }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout du produit à la base de données.");
        }

        const result = await response.json();
        const addedProduct = {
          id: result.data.id,
          ...newProduct,
        };

        // Ajouter le produit à l'état local
        setProducts((prevProducts) => [...prevProducts, addedProduct]);
        showNotification("Produit ajouté avec succès !");
      } catch (err) {
        console.error("Erreur lors de l'ajout du produit :", err);
        showNotification("Une erreur est survenue lors de l'ajout du produit.");
      }
    }

    // Réinitialiser le formulaire
    setForm({ Name: "", price: "", Categorie: "", promo: false });
  };

  const handleProductEdit = (productId) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productId);
      setForm({
        Name: productToEdit.Name,
        price: productToEdit.price,
        Categorie: productToEdit.Categorie,
        promo: productToEdit.promo,
      });
    }
  };

  const handleProductDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const openUserEditModal = (user) => {
    setEditingUser(user.id);
    setUserForm({
      username: user.username,
      email: user.email,
      confirmed: user.confirmed,
      blocked: user.blocked,
    });
  };

  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveUserChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === editingUser ? { ...user, ...userForm } : user
      )
    );
    setEditingUser(null);
    setUserForm({ username: "", email: "", confirmed: false, blocked: false });
  };

  if (loading)
    return (
      <div className="admin-root">
        <h1 className="admin-title">Portail Admin</h1>
        <p style={{ textAlign: "center", marginTop: 60, fontSize: 18 }}>
          Chargement des données...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="admin-root">
        <h1 className="admin-title">Portail Admin</h1>
        <p style={{ color: "red", textAlign: "center", marginTop: 60 }}>
          Erreur : {error}
        </p>
      </div>
    );

  // Calcul des statistiques pertinentes
  const revenueByDay = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});

  const topCategories = products.reduce((acc, product) => {
    acc[product.Categorie] = (acc[product.Categorie] || 0) + 1;
    return acc;
  }, {});

  const userStats = {
    confirmed: users.filter((user) => user.confirmed).length,
    blocked: users.filter((user) => user.blocked).length,
  };

  return (
    <div className="admin-root">
      <h1 className="admin-title">Portail Admin</h1>

      {/* Notification */}
      {notification && <div className="admin-notification">{notification}</div>}

      {/* Onglets */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
          Statistiques
        </button>
        <button className={`admin-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Utilisateurs
        </button>
        <button className={`admin-tab ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          Produits
        </button>
        <button className={`admin-tab ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
          Commandes
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "stats" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Statistiques</h2>
          <div className="admin-chart-container">
            {/* Revenu par jour */}
            <div className="admin-chart">
              <h3 className="admin-chart-title">Revenu par jour</h3>
              <Bar
                data={{
                  labels: Object.keys(revenueByDay),
                  datasets: [
                    {
                      label: "Revenu (€)",
                      data: Object.values(revenueByDay),
                      backgroundColor: "#36A2EB",
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: true, labels: { color: "#2c2c2c" } },
                  },
                  scales: {
                    x: { ticks: { color: "#2c2c2c" } },
                    y: { ticks: { color: "#2c2c2c" } },
                  },
                }}
              />
            </div>

            {/* Produits par catégorie */}
            <div className="admin-chart">
              <h3 className="admin-chart-title">Produits par catégorie</h3>
              <Pie
                data={{
                  labels: Object.keys(topCategories),
                  datasets: [
                    {
                      data: Object.values(topCategories),
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: true, labels: { color: "#2c2c2c" } },
                  },
                }}
              />
            </div>

            {/* Utilisateurs confirmés et bloqués */}
            <div className="admin-chart">
              <h3 className="admin-chart-title">Utilisateurs</h3>
              <Pie
                data={{
                  labels: ["Confirmés", "Bloqués"],
                  datasets: [
                    {
                      data: [userStats.confirmed, userStats.blocked],
                      backgroundColor: ["#4BC0C0", "#FF6384"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: true, labels: { color: "#2c2c2c" } },
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}

      {activeTab === "users" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Utilisateurs</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom d'utilisateur</th>
                  <th>Email</th>
                  <th>Confirmé</th>
                  <th>Bloqué</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.confirmed ? "Oui" : "Non"}</td>
                    <td>{user.blocked ? "Oui" : "Non"}</td>
                    <td>
                      <button
                        className="admin-btn"
                        onClick={() => resetPassword(user.email)}
                      >
                        Réinitialiser le mot de passe
                      </button>
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => openUserEditModal(user)}
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de modification des utilisateurs */}
          {editingUser && (
            <div className="admin-modal">
              <div className="admin-modal-content">
                <h3>Modifier l'utilisateur</h3>
                <div className="admin-form">
                  <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={userForm.username}
                    onChange={handleUserFormChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                  />
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      name="confirmed"
                      checked={userForm.confirmed}
                      onChange={handleUserFormChange}
                    />
                    Confirmé
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      name="blocked"
                      checked={userForm.blocked}
                      onChange={handleUserFormChange}
                    />
                    Bloqué
                  </label>
                  <div>
                    <button className="admin-btn" onClick={saveUserChanges}>
                      Enregistrer
                    </button>
                    <button
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "products" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Produits</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Promo</th>
                  <th>Catégorie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.Name}</td>
                    <td>{p.price}€</td>
                    <td>{p.promo ? "Oui" : "Non"}</td>
                    <td>{p.Categorie}</td>
                    <td>
                      <button
                        className="admin-btn"
                        onClick={() => handleProductEdit(p.id)}
                      >
                        Modifier
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleProductDelete(p.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-form-wrap">
            <h3>{editingProduct ? "Modifier" : "Ajouter"} un produit</h3>
            <div className="admin-form">
              <input
                type="text"
                placeholder="Nom"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Prix"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={form.Categorie}
                onChange={(e) => setForm({ ...form, Categorie: e.target.value })}
              />
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={form.promo}
                  onChange={(e) => setForm({ ...form, promo: e.target.checked })}
                />
                Promo
              </label>
              <button className="admin-btn" onClick={handleProductSave}>
                {editingProduct ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="admin-section">
          <h2 className="admin-section-title">Commandes</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Téléphone</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.address}</td>
                    <td>{order.phone}</td>
                    <td>
                      <ul>
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.name} x {item.quantity} ({item.price}€)
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{order.total}€</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
