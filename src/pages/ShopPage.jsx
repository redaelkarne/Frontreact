import React, { useEffect, useState } from "react";
import { featuredProducts } from "./mockData";
import "./ShopPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Importez l'icône de poubelle

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

// Fonction pour récupérer les produits depuis Strapi
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/featured-products?populate=img');
    const data = await response.json();

    console.log("Réponse brute de Strapi:", data);

    if (!Array.isArray(data?.data)) {
      console.error("Réponse inattendue de Strapi:", data);
      return [];
    }

    return data.data.map((item) => {
      const attributes = item.attributes || {};
      const imageUrl = attributes.img?.data?.attributes?.url
        ? `http://localhost:1337${attributes.img.data.attributes.url}`
        : "";

      return {
       id: item.id,
      name: item.Name,
      price: item.price,
      originalPrice: item.originalPrice,
      promo: item.promo,
      img: `http://localhost:1337${item.img?.url || ""}`,
      categorie: item.Categorie || "Autre", // Assurez-vous que chaque produit a une catégorie valide
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    return [];
  }
};


function fakeAddToCart(productId) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, productId }), 500)
  );
}

const CATEGORIES = [
  {
    label: "Accessoires",
    children: [
      { label: "Bandeaux / bonnets", count: 5 },
      { label: "Porte-clé", count: 3 },
      { label: "Sacs / Bananes", count: 1 },
      { label: "Scrunchy", count: 2 }
    ]
  },
  { label: "Cuisine" },
  { label: "Déco", children: [{ label: "Wire art", count: 1 }] },
  { label: "Vêtement", children: [{ label: "Top", count: 1 }] }
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    // Charger le panier depuis localStorage au démarrage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notif, setNotif] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // État pour la fenêtre modale du panier
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false); // État pour la fenêtre modale de paiement
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    setIsLoggedIn(!!jwt);

    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    // Sauvegarder le panier dans localStorage à chaque modification
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function handleAddToCart(product) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Augmenter la quantité si le produit est déjà dans le panier
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Ajouter un nouveau produit au panier
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setNotif(`"${product.name}" ajouté au panier !`);
    setTimeout(() => setNotif(null), 1800);
  }

  function handleRemoveFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  function handleUpdateQuantity(productId, quantity) {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function handleDeliveryChange(e) {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  }

  const sendOrderToStrapi = async (orderData) => {
    try {
      const response = await fetch('http://localhost:1337/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: orderData }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la commande.');
      }

      const result = await response.json();
      console.log('Commande enregistrée dans Strapi :', result);
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la commande à Strapi :', err);
      return null;
    }
  };

  function handleCheckout() {
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone || (!isLoggedIn && !deliveryInfo.email)) {
  alert("Veuillez remplir toutes les informations de livraison" + (!isLoggedIn ? " et votre adresse e-mail." : "."));
  return;
}



    const orderData = {
      name: deliveryInfo.name,
      address: deliveryInfo.address,
      phone: deliveryInfo.phone,
      email: deliveryInfo.email,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    // Envoyer les données de commande à Strapi
    sendOrderToStrapi(orderData).then((result) => {
      if (result) {
        setIsCartOpen(false); // Fermer la fenêtre du panier
        setIsPaymentOpen(true); // Ouvrir la fenêtre de paiement
      } else {
        alert('Une erreur est survenue lors de l\'enregistrement de la commande.');
      }
    });
  }

  function handlePaymentSuccess() {
    setIsPaymentOpen(false);
    setCart([]); // Vider le panier après le paiement
    alert("Paiement réussi ! Merci pour votre commande.");
  }

  const allCategories = Array.from(new Set(products.map((p) => p.categorie)));

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(p.categorie);
    return matchSearch && matchCategory;
  });


  return (
    <div className="shop-root">
      <header className="shop-header">
        <div className="main-container">
          <h1>La Boutique</h1>
          <p>Découvrez toutes nos créations artisanales et ajoutez-les à votre panier.</p>
        </div>
      </header>
      {notif && <div className="shop-notif">{notif}</div>}
      <main className="shop-main main-container">
        {/* Barre de recherche et filtre combinés */}
        <aside className="shop-sidebar">
          <form className="shop-search-box" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="shop-search-icon">🔍</span>
          </form>
          <div className="shop-categories">
            <div className="shop-sidebar-title">Catégories</div>
            <ul className="shop-category-list">
              {allCategories.map((cat) => (
                <li key={cat}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(cat)
                            ? prev.filter((c) => c !== cat)
                            : [...prev, cat]
                        )
                      }
                    />
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main grid */}
        <section className="shop-products-section">
          <h2>Nos créations disponibles</h2>
          <div className="shop-products-grid">
            {filteredProducts.length === 0 && (
              <div className="shop-loading">Aucun produit trouvé.</div>
            )}
            {filteredProducts.map((product) => (
              <div key={product.id} className="shop-product-card">
                {product.promo && (
                  <div className="shop-product-promo">EN PROMO !</div>
                )}
                <div className="shop-product-img-wrap">
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="shop-product-content">
                  <div style={{ color: "#ff6b9d", fontWeight: 600, fontSize: "0.95em", marginBottom: 2 }}>
                    {product.categorie}
                  </div>
                  <h3>{product.name}</h3>
                  <div className="shop-product-prices">
                    <span className="shop-product-price">{product.price}€</span>
                    {product.originalPrice && (
                      <span className="shop-product-original">{product.originalPrice}€</span>
                    )}
                  </div>
                  <button
                    className="shop-add-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bouton pour ouvrir le panier */}
        <button
          className="shop-cart-btn"
          onClick={() => {
            const jwt = localStorage.getItem('jwt');
            if (jwt) {
              setIsCartOpen(true);
            } else {
              setIsGuestModalOpen(true);
            }
          }}
        >
          Voir le panier
        </button>


        {/* Fenêtre modale pour le panier */}
        {isCartOpen && (
          <div className="shop-cart-modal">
            <div className="shop-cart-modal-content">
              <button
                className="shop-cart-close-btn"
                onClick={() => setIsCartOpen(false)}
              >
                ✖
              </button>
              <h2>Votre Panier</h2>
              {cart.length === 0 ? (
                <p>Votre panier est vide.</p>
              ) : (
                <ul className="shop-cart-list">
                  {cart.map((item) => (
                    <li key={item.id} className="shop-cart-item">
                      <div>
                        <strong>{item.name}</strong> - {item.price}€ x{" "}
                        {item.quantity}
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <FaTrash /> {/* Icône de poubelle */}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {cart.length > 0 && (
                <div className="shop-delivery-form">
                  <h3>Informations de livraison</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nom complet"
                    value={deliveryInfo.name}
                    onChange={handleDeliveryChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={deliveryInfo.address}
                    onChange={handleDeliveryChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Téléphone"
                    value={deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                  />
                  {!isLoggedIn && (
                  <input
                    type="email"
                    name="email"
                    placeholder="Adresse e-mail"
                    value={deliveryInfo.email}
                    onChange={handleDeliveryChange}
                  />
                 )}

                  <button className="shop-checkout-btn" onClick={handleCheckout}>
                    Passer au paiement
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fenêtre modale pour le paiement */}
        {isPaymentOpen && (
          <div className="shop-cart-modal">
            <div className="shop-cart-modal-content">
              <button
                className="shop-cart-close-btn"
                onClick={() => setIsPaymentOpen(false)}
              >
                ✖
              </button>
              <h2>Paiement</h2>
              <p>Montant total : {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}€</p>
              <button className="shop-checkout-btn" onClick={handlePaymentSuccess}>
                Simuler le paiement
              </button>
            </div>
          </div>
        )}
        {isGuestModalOpen && (
  <div className="shop-cart-modal">
    <div className="shop-cart-modal-content">
      <button
        className="shop-cart-close-btn"
        onClick={() => setIsGuestModalOpen(false)}
      >
        ✖
      </button>
      <h2>Connexion requise</h2>
      <p>Veuillez vous connecter ou continuer comme invité pour accéder à votre panier.</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          className="shop-checkout-btn"
          onClick={() => navigate('/login')}
        >
          Se connecter
        </button>
        <button
          className="shop-checkout-btn"
          onClick={() => {
            setIsGuestModalOpen(false);
            setIsCartOpen(true);
          }}
        >
          Continuer comme invité
        </button>
      </div>
    </div>
  </div>
)}
      </main>
      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <p className="landing-footer-links">
            <a href="#">Mentions légales</a> | <a href="#">CGV</a> | <a href="#">Contact</a>
          </p>
          <p>© 2025 Artisan Créations - Fait main avec passion dans les Hautes-Alpes</p>
        </div>
      </footer>
    </div>
  );
}
