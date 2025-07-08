import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./AdminPage.css";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("stats"); // Onglet actif
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ Name: "", price: "", Categorie: "", promo: false });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Utilisateur en cours de modification
  const [userForm, setUserForm] = useState({ username: "", email: "", confirmed: false, blocked: false });
  const [notification, setNotification] = useState(null); // État pour la notification
  const [commandes, setCommandes] = useState([]);
  const [loadingCommandes, setLoadingCommandes] = useState(false);
  const [editingStatut, setEditingStatut] = useState(null);
  const [selectedCommande, setSelectedCommande] = useState(null);

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
        setCommandes(orderData.data || []); // Utiliser les mêmes données
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
      const productToUpdate = products.find(p => p.id === editingProduct);
      if (!productToUpdate || !productToUpdate.documentId) {
        showNotification("Erreur: documentId non trouvé pour ce produit");
        return;
      }

      const updatedProduct = {
        Name: form.Name.trim(),
        price: parseFloat(form.price) || 0,
        Categorie: form.Categorie.trim(),
        promo: form.promo,
      };

      if (!updatedProduct.Name || !updatedProduct.Categorie) {
        showNotification("Veuillez remplir tous les champs obligatoires (Nom et Catégorie).");
        return;
      }

      try {
        console.log('Modification du produit:', productToUpdate.documentId, updatedProduct);
        const response = await fetch(`http://localhost:1337/api/featured-products/${productToUpdate.documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: updatedProduct }),
        });

        const responseData = await response.json();
        console.log('Réponse de modification:', response.status, responseData);

        if (!response.ok) {
          console.error('Erreur détaillée:', responseData);
          throw new Error(`Erreur ${response.status}: ${responseData.error?.message || 'Erreur lors de la modification du produit dans la base de données.'}`);
        }

        // Mettre à jour l'état local
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === editingProduct ? { ...p, ...updatedProduct } : p
          )
        );
        setEditingProduct(null);
        showNotification("Produit modifié avec succès !");
      } catch (err) {
        console.error("Erreur lors de la modification du produit :", err);
        showNotification(`Une erreur est survenue lors de la modification du produit: ${err.message}`);
      }
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
          documentId: result.data.documentId,
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

  const handleProductDelete = async (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete || !productToDelete.documentId) {
      showNotification("Erreur: documentId non trouvé pour ce produit");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      console.log('Suppression du produit:', productToDelete.documentId);
      const response = await fetch(`http://localhost:1337/api/featured-products/${productToDelete.documentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('Réponse de suppression:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur détaillée:', errorData);
        throw new Error(`Erreur ${response.status}: ${errorData.error?.message || 'Erreur lors de la suppression du produit dans la base de données.'}`);
      }

      // Mettre à jour l'état local
      setProducts(products.filter((p) => p.id !== id));
      showNotification("Produit supprimé avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression du produit :", err);
      showNotification(`Une erreur est survenue lors de la suppression du produit: ${err.message}`);
    }
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

  const fetchCommandes = async () => {
    setLoadingCommandes(true);
    try {
      const response = await fetch('http://localhost:1337/api/commandes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Commandes récupérées:', data);
        setCommandes(data.data || []);
      } else {
        console.error('Erreur lors de la récupération des commandes');
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoadingCommandes(false);
    }
  };

  const updateCommandeStatut = async (commandeId, newStatut) => {
    // Trouver la commande pour récupérer le documentId
    const commande = orders.find(order => order.id === commandeId);
    if (!commande || !commande.documentId) {
      showNotification('Erreur: documentId non trouvé pour cette commande');
      return;
    }

    try {
      // Utiliser documentId au lieu de id pour la mise à jour
      const response = await fetch(`http://localhost:1337/api/commandes/${commande.documentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            Statut: newStatut
          }
        }),
      });

      if (response.ok) {
        // Mettre à jour les deux listes locales (orders et commandes)
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === commandeId 
              ? { ...order, Statut: newStatut }
              : order
          )
        );
        setCommandes(prevCommandes => 
          prevCommandes.map(cmd => 
            cmd.id === commandeId 
              ? { ...cmd, Statut: newStatut }
              : cmd
          )
        );
        setEditingStatut(null);
        showNotification('Statut mis à jour avec succès !');
      } else {
        const errorData = await response.text();
        console.error(`Erreur ${response.status}: ${response.statusText}`, errorData);
        showNotification(`Erreur lors de la mise à jour du statut: ${response.status}`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      showNotification('Erreur de connexion lors de la mise à jour du statut');
    }
  };

  const getStatutColor = (statut) => {
    const cleanStatut = statut?.trim();
    switch (cleanStatut) {
      case 'Livrée': return '#28a745';
      case 'En Livraison': return '#007bff';
      case 'En cours': return '#ffc107';
      case 'Annulée': return '#dc3545';
      default: return '#6c757d';
    }
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
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: { display: true, labels: { color: "#2c2c2c" } },
                  },
                  scales: {
                    x: { 
                      ticks: { color: "#2c2c2c" },
                      grid: { display: true }
                    },
                    y: { 
                      ticks: { color: "#2c2c2c" },
                      grid: { display: true },
                      beginAtZero: true
                    },
                  },
                  layout: {
                    padding: {
                      top: 10,
                      bottom: 10
                    }
                  }
                }}
                height={300}
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
                value={form.Name || ""}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Prix"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <select
                value={form.Categorie || ""}
                onChange={(e) => setForm({ ...form, Categorie: e.target.value })}
                style={{ 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Organic">Organic</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Textile">Textile</option>
              </select>
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
          <h2 className="admin-section-title">Gestion des Commandes</h2>
          <div className="admin-table-wrap">
            <div className="admin-content-header">
              <button onClick={fetchCommandes} className="admin-btn">
                Actualiser
              </button>
            </div>

            <div className="commandes-stats" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="stat-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>Total</h3>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</span>
              </div>
              <div className="stat-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>En cours</h3>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {orders.filter(order => 
                    ['En cours', 'En Livraison'].includes(order.Statut?.trim())
                  ).length}
                </span>
              </div>
              <div className="stat-card" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <h3>Livrées</h3>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {orders.filter(order => order.Statut?.trim() === 'Livrée').length}
                </span>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.email || 'N/A'}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {order.items?.map((item, i) => (
                          <li key={i} style={{ fontSize: '0.9rem', marginBottom: '2px' }}>
                            {item.name} x {item.quantity} ({item.price}€)
                          </li>
                        )) || <li>Aucun article</li>}
                      </ul>
                    </td>
                    <td>{order.total}€</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {editingStatut === order.id ? (
                        <select 
                          defaultValue={order.Statut?.trim() || 'En cours'}
                          onChange={(e) => updateCommandeStatut(order.id, e.target.value)}
                          className="admin-select"
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="En cours ">En cours</option>
                          <option value="En Livraison ">En Livraison</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      ) : (
                        <span 
                          className="statut-badge"
                          style={{ 
                            backgroundColor: getStatutColor(order.Statut),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-block'
                          }}
                          onClick={() => setEditingStatut(order.id)}
                        >
                          {order.Statut?.trim() || 'En cours'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="admin-btn"
                          onClick={() => setSelectedCommande(order)}
                          style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                        >
                          Voir
                        </button>
                        {editingStatut === order.id ? (
                          <button 
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setEditingStatut(null)}
                            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                          >
                            Annuler
                          </button>
                        ) : (
                          <button 
                            className="admin-btn"
                            onClick={() => setEditingStatut(order.id)}
                            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                          >
                            Modifier
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal détails commande */}
            {selectedCommande && (
              <div 
                className="admin-modal"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}
                onClick={() => setSelectedCommande(null)}
              >
                <div 
                  className="admin-modal-content"
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Détails de la commande #{selectedCommande.id}</h3>
                    <button 
                      onClick={() => setSelectedCommande(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <h4>Informations client</h4>
                      <p><strong>Nom:</strong> {selectedCommande.name}</p>
                      <p><strong>Email:</strong> {selectedCommande.email || 'N/A'}</p>
                      <p><strong>Téléphone:</strong> {selectedCommande.phone}</p>
                      <p><strong>Adresse:</strong> {selectedCommande.address}</p>
                    </div>
                    
                    <div>
                      <h4>Informations commande</h4>
                      <p><strong>Date:</strong> {new Date(selectedCommande.createdAt).toLocaleString('fr-FR')}</p>
                      <p><strong>Statut:</strong> 
                        <span 
                          style={{ 
                            backgroundColor: getStatutColor(selectedCommande.Statut),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            marginLeft: '8px'
                          }}
                        >
                          {selectedCommande.Statut || 'En attente'}
                        </span>
                      </p>
                      <p><strong>Total:</strong> {selectedCommande.total}€</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4>Articles commandés</h4>
                    {selectedCommande.items && selectedCommande.items.length > 0 ? (
                      <div>
                        {selectedCommande.items.map((item, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '8px 0', 
                            borderBottom: '1px solid #eee' 
                          }}>
                            <span>{item.name}</span>
                            <span>Qté: {item.quantity}</span>
                            <span>{item.price}€</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Aucun article détaillé</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminPage;


