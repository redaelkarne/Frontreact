import React, { useEffect, useState } from "react";
import "./ShopPage.css";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

// Fonction pour récupérer les produits depuis Strapi
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/featured-products?populate=img');
    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Réponse inattendue de Strapi:", data);
      return [];
    }

    return data.data.map((item) => {
      const attributes = item.attributes || {};
      return {
        id: item.id,
        name: attributes.Name || item.Name,
        price: attributes.price || item.price,
        originalPrice: attributes.originalPrice || item.originalPrice,
        promo: attributes.promo || item.promo,
        img: attributes.img?.data?.attributes?.url
          ? `http://localhost:1337${attributes.img.data.attributes.url}`
          : `http://localhost:1337${item.img?.url || ""}`,
        categorie: attributes.Categorie || item.Categorie || "Autre",
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des produits:", err);
    return [];
  }
};

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notif, setNotif] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function handleAddToCart(product) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showNotification(`"${product.name}" ajouté au panier !`);
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
        throw new Error(`Erreur ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la commande:', err);
      return null;
    }
  };

  function handleCheckout() {
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone || (!isLoggedIn && !deliveryInfo.email)) {
      showNotification("Veuillez remplir toutes les informations de livraison" + (!isLoggedIn ? " et votre adresse e-mail." : "."));
      return;
    }

    const orderData = {
      name: deliveryInfo.name.trim(),
      address: deliveryInfo.address.trim(),
      phone: deliveryInfo.phone.trim(),
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      total: parseFloat(cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
    };

    if (!isLoggedIn && deliveryInfo.email) {
      orderData.email = deliveryInfo.email.trim();
    }

    sendOrderToStrapi(orderData).then((result) => {
      if (result) {
        setIsCartOpen(false);
        setIsPaymentOpen(true);
        showNotification("Commande enregistrée avec succès !");
      } else {
        showNotification('Une erreur est survenue lors de l\'enregistrement de la commande.');
      }
    });
  }

  const showNotification = (message) => {
    setNotif(message);
    setTimeout(() => setNotif(null), 3000);
  };

  const allCategories = Array.from(new Set(products.map((p) => p.categorie)));

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(p.categorie);
    return matchSearch && matchCategory;
  });

  const simulatePayment = async (amount) => {
    return new Promise((resolve, reject) => {
      const simModal = document.createElement('div');
      simModal.className = 'stripe-card-modal';
      simModal.innerHTML = `
        <div class="stripe-card-modal-content">
          <h3>💳 Paiement Sécurisé</h3>
          <p style="text-align: center; color: #666; margin: 16px 0;">
            Montant à payer : ${amount.toFixed(2)}€
          </p>
          
          <!-- Formulaire de carte de crédit -->
          <div style="margin: 20px 0;">
            <input 
              type="text" 
              id="card-number" 
              placeholder="Numéro de carte (ex: 4242 4242 4242 4242)" 
              style="width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px;"
              maxlength="19"
            />
            <div style="display: flex; gap: 12px;">
              <input 
                type="text" 
                id="card-expiry" 
                placeholder="MM/AA" 
                style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px;"
                maxlength="5"
              />
              <input 
                type="text" 
                id="card-cvc" 
                placeholder="CVC" 
                style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px;"
                maxlength="3"
              />
            </div>
            <input 
              type="text" 
              id="card-name" 
              placeholder="Nom sur la carte" 
              style="width: 100%; padding: 12px; margin-top: 12px; border: 1px solid #ddd; border-radius: 8px;"
            />
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button id="sim-success" style="flex: 1; background: #4caf50; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
              Confirmer le Paiement
            </button>
            <button id="sim-cancel" style="flex: 1; background: #dc3545; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
              Annuler
            </button>
          </div>
          
          <div style="margin-top: 16px; padding: 12px; background: #f0f8ff; border-radius: 8px; font-size: 0.9rem; color: #666; text-align: center;">
            🔒 Mode Démonstration - Aucun paiement réel ne sera effectué
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .stripe-card-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .stripe-card-modal-content {
          background: white;
          padding: 32px;
          border-radius: 16px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .stripe-card-modal h3 {
          margin: 0 0 20px 0;
          text-align: center;
          color: #333;
          font-size: 1.4rem;
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(simModal);

      // Formatage automatique du numéro de carte
      const cardNumberInput = document.getElementById('card-number');
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
      });

      // Formatage de la date d'expiration
      const cardExpiryInput = document.getElementById('card-expiry');
      cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
      });

      // Validation basique avant de "payer"
      const successButton = document.getElementById('sim-success');
      const cancelButton = document.getElementById('sim-cancel');

      successButton.addEventListener('click', () => {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;
        const cardName = document.getElementById('card-name').value;

        // Validation simple
        if (!cardNumber || cardNumber.length < 16) {
          alert('Veuillez entrer un numéro de carte valide');
          return;
        }
        if (!cardExpiry || cardExpiry.length < 5) {
          alert('Veuillez entrer une date d\'expiration valide (MM/AA)');
          return;
        }
        if (!cardCvc || cardCvc.length < 3) {
          alert('Veuillez entrer un code CVC valide');
          return;
        }
        if (!cardName.trim()) {
          alert('Veuillez entrer le nom sur la carte');
          return;
        }

        // Simulation d'un délai de traitement
        successButton.textContent = 'Traitement...';
        successButton.disabled = true;
        
        setTimeout(() => {
          document.body.removeChild(simModal);
          document.head.removeChild(style);
          resolve({ 
            status: 'succeeded', 
            id: 'sim_' + Date.now(),
            card: '**** **** **** ' + cardNumber.slice(-4)
          });
        }, 2000);
      });

      cancelButton.addEventListener('click', () => {
        document.body.removeChild(simModal);
        document.head.removeChild(style);
        reject(new Error('Paiement annulé'));
      });
    });
  };

  const handlePaymentClick = async () => {
    setIsProcessingPayment(true);
    try {
      const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const result = await simulatePayment(amount);
      
      if (result && result.status === 'succeeded') {
        setIsPaymentOpen(false);
        setCart([]);
        setDeliveryInfo({ name: "", address: "", phone: "", email: "" });
        showNotification(`Paiement réussi avec la carte ${result.card} ! Merci pour votre commande.`);
      }
    } catch (error) {
      if (error.message !== 'Paiement annulé') {
        showNotification(`Erreur de paiement: ${error.message}`);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
          Voir le panier ({cart.length})
        </button>

        {/* Modal Panier */}
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
                <>
                  <ul className="shop-cart-list">
                    {cart.map((item) => (
                      <li key={item.id} className="shop-cart-item">
                        <div>
                          <strong>{item.name}</strong> - {item.price}€ x {item.quantity}
                        </div>
                        <div>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
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
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal Paiement */}
        {isPaymentOpen && (
          <div className="shop-cart-modal">
            <div className="shop-cart-modal-content">
              <button
                className="shop-cart-close-btn"
                onClick={() => setIsPaymentOpen(false)}
                disabled={isProcessingPayment}
              >
                ✖
              </button>
              <h2>Récapitulatif de la commande</h2>
              
              <div style={{ marginBottom: "20px" }}>
                <h4>Articles commandés :</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cart.map((item) => (
                    <li key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: "20px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                <h4>Livraison :</h4>
                <p><strong>Nom :</strong> {deliveryInfo.name}</p>
                <p><strong>Adresse :</strong> {deliveryInfo.address}</p>
                <p><strong>Téléphone :</strong> {deliveryInfo.phone}</p>
                {deliveryInfo.email && <p><strong>Email :</strong> {deliveryInfo.email}</p>}
              </div>

              <div style={{ marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold", textAlign: "center" }}>
                Total : {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€
              </div>

              <button 
                className="shop-checkout-btn" 
                onClick={handlePaymentClick}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Traitement..." : "Procéder au paiement"}
              </button>
            </div>
          </div>
        )}

        {/* Modal Invité */}
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

     
    </div>
  );
}