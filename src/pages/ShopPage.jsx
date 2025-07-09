import React, { useEffect, useState } from "react";
import "./ShopPage.css";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ReferralWidget from "../components/ReferralWidget";
import referralService from "../services/referralService"; // Importer le service

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

const PRICE_MIN = 0;
const PRICE_MAX = 100;

const ShopPage = () => {
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
  const [userEmail, setUserEmail] = useState('');
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [paymentCart, setPaymentCart] = useState([]);
  const [paymentDeliveryInfo, setPaymentDeliveryInfo] = useState(null);
  
  // Nouveaux états pour les récompenses de parrainage
  const [referralRewards, setReferralRewards] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showReferralDiscount, setShowReferralDiscount] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    setIsLoggedIn(!!jwt);

    // Récupérer l'email de l'utilisateur connecté
    if (jwt) {
      fetchUserEmail();
      fetchReferralRewards(); // Récupérer les récompenses disponibles
    }

    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  const fetchUserEmail = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await fetch('http://localhost:1337/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserEmail(userData.email || '');
        // Pré-remplir l'email dans deliveryInfo
        setDeliveryInfo(prev => ({
          ...prev,
          email: userData.email || ''
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'email utilisateur:', err);
    }
  };

  const fetchReferralRewards = async () => {
    console.log('💰 ShopPage: Récupération des récompenses de parrainage');
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return;

      const response = await fetch('http://localhost:1337/api/referrals/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('💰 ShopPage: Récompenses récupérées:', data.referralRewards);
        setReferralRewards(data.referralRewards || 0);
      }
    } catch (err) {
      console.error('❌ ShopPage: Erreur récupération récompenses:', err);
    }
  };

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

  const handleApplyReferralDiscount = () => {
    console.log('💰 ShopPage: Application de la réduction parrainage');
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const maxDiscount = Math.min(referralRewards, cartTotal);
    
    setAppliedDiscount(maxDiscount);
    setShowReferralDiscount(false);
    console.log(`💰 ShopPage: Réduction appliquée: ${maxDiscount}€`);
  };

  const handleRemoveReferralDiscount = () => {
    console.log('💰 ShopPage: Suppression de la réduction parrainage');
    setAppliedDiscount(0);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.max(0, subtotal - appliedDiscount);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const sendOrderToStrapi = async (orderData) => {
    console.log('📦 ShopPage: === DÉBUT DEBUG COMMANDE ===');
    console.log('📦 ShopPage: Envoi commande à Strapi:', orderData);
    console.log('📦 ShopPage: Type de chaque champ:');
    Object.keys(orderData).forEach(key => {
      console.log(`   ${key}: ${typeof orderData[key]} = "${orderData[key]}"`);
    });
    
    try {
      const requestBody = { data: orderData };
      console.log('📦 ShopPage: Corps de la requête final:', requestBody);
      
      // Vérifier si JSON.stringify fonctionne
      let jsonString;
      try {
        jsonString = JSON.stringify(requestBody);
        console.log('📦 ShopPage: JSON stringifié avec succès, longueur:', jsonString.length);
        console.log('📦 ShopPage: Extrait JSON (premiers 500 chars):', jsonString.substring(0, 500));
      } catch (jsonError) {
        console.error('❌ ShopPage: Erreur JSON.stringify:', jsonError);
        return null;
      }

      console.log('📦 ShopPage: Envoi de la requête à http://localhost:1337/api/commandes');
      const response = await fetch('http://localhost:1337/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonString,
      });

      console.log('📦 ShopPage: Statut réponse:', response.status);
      console.log('📦 ShopPage: Status text:', response.statusText);
      console.log('📦 ShopPage: Headers de réponse:');
      response.headers.forEach((value, key) => {
        console.log(`   ${key}: ${value}`);
      });

      // Lire la réponse comme text d'abord
      const responseText = await response.text();
      console.log('📦 ShopPage: Réponse brute (text):', responseText);

      // Essayer de parser en JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('📦 ShopPage: Données de réponse parsées:', responseData);
      } catch (parseError) {
        console.error('❌ ShopPage: Impossible de parser la réponse JSON:', parseError);
        console.log('📦 ShopPage: Réponse brute était:', responseText);
        return null;
      }

      if (!response.ok) {
        console.log('❌ ShopPage: === DÉTAILS COMPLETS DE L\'ERREUR ===');
        console.log('❌ ShopPage: Response status:', response.status);
        console.log('❌ ShopPage: Response data:', responseData);
        
        if (responseData.error) {
          console.log('❌ ShopPage: error.message:', responseData.error.message);
          console.log('❌ ShopPage: error.details:', responseData.error.details);
          console.log('❌ ShopPage: error.name:', responseData.error.name);
          
          if (responseData.error.details && Array.isArray(responseData.error.details.errors)) {
            console.log('❌ ShopPage: Détails des erreurs de validation:');
            responseData.error.details.errors.forEach((err, index) => {
              console.log(`   Erreur ${index + 1}:`, err);
              console.log(`     - path: ${err.path}`);
              console.log(`     - message: ${err.message}`);
              console.log(`     - name: ${err.name}`);
            });
          }
        }
        
        // Améliorer l'affichage de l'erreur
        let errorMessage = 'Erreur inconnue';
        if (responseData.error) {
          if (responseData.error.details && responseData.error.details.errors) {
            errorMessage = responseData.error.details.errors.map(err => 
              `${err.path}: ${err.message}`
            ).join(', ');
          } else if (responseData.error.message) {
            errorMessage = responseData.error.message;
          }
        }
        
        console.error('❌ ShopPage: Message d\'erreur final:', errorMessage);
        throw new Error(`Erreur ${response.status}: ${errorMessage}`);
      }

      console.log('✅ ShopPage: Commande envoyée avec succès');
      return responseData;
    } catch (err) {
      console.error('❌ ShopPage: === ERREUR GÉNÉRALE ===');
      console.error('❌ ShopPage: Type d\'erreur:', err.constructor.name);
      console.error('❌ ShopPage: Message:', err.message);
      console.error('❌ ShopPage: Stack:', err.stack);
      return null;
    }
  };

  function handleCheckout() {
    console.log('🛒 ShopPage: === DÉBUT CHECKOUT ===');
    console.log('🛒 ShopPage: Vérification des informations de livraison...');
    console.log('🛒 ShopPage: deliveryInfo:', deliveryInfo);
    console.log('🛒 ShopPage: isLoggedIn:', isLoggedIn);
    console.log('🛒 ShopPage: userEmail:', userEmail);
    
    if (!deliveryInfo.name || !deliveryInfo.address || !deliveryInfo.phone || (!isLoggedIn && !deliveryInfo.email)) {
      console.log('❌ ShopPage: Informations manquantes');
      showNotification("Veuillez remplir toutes les informations de livraison" + (!isLoggedIn ? " et votre adresse e-mail." : "."));
      return;
    }

    const subtotal = getSubtotal();
    const finalTotal = getCartTotal();
    
    console.log('🛒 ShopPage: Calculs:');
    console.log('   - Sous-total:', subtotal);
    console.log('   - Réduction appliquée:', appliedDiscount);
    console.log('   - Total final:', finalTotal);
    console.log('🛒 ShopPage: Panier:', cart);

    // Structure corrigée avec la bonne valeur pour Statut (avec l'espace)
    const orderData = {
      name: deliveryInfo.name.trim(),
      email: isLoggedIn ? userEmail : deliveryInfo.email.trim(),
      phone: deliveryInfo.phone.trim(),
      address: deliveryInfo.address.trim(),
      items: JSON.stringify(cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))),
      total: finalTotal.toFixed(2),
      ...(appliedDiscount > 0 && { discount: appliedDiscount.toFixed(2) }),
      Statut: 'En Livraison '  // Ajouter l'espace à la fin comme requis par Strapi
    };

    console.log('🛒 ShopPage: Données finales pour Strapi (avec Statut: "En cours "):', orderData);
    console.log('🛒 ShopPage: === ENVOI À STRAPI ===');

    sendOrderToStrapi(orderData).then((result) => {
      console.log('🛒 ShopPage: Résultat de sendOrderToStrapi:', result);
      if (result) {
        console.log('✅ ShopPage: Commande enregistrée avec succès:', result);
        setIsCartOpen(false);
        setIsPaymentOpen(true);
        setPaymentCart(cart);
        setPaymentDeliveryInfo(deliveryInfo);
        showNotification("Commande enregistrée avec succès !");
      } else {
        console.error('❌ ShopPage: Échec enregistrement commande');
        showNotification('Une erreur est survenue lors de l\'enregistrement de la commande. Veuillez réessayer.');
      }
    }).catch((error) => {
      console.error('❌ ShopPage: Erreur Promise:', error);
      showNotification('Erreur de connexion. Veuillez vérifier votre connexion internet.');
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

  // Filtrage des produits selon la plage de prix
  const filteredProductsByPrice = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

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
      const amount = getCartTotal();
      const result = await simulatePayment(amount);
      
      if (result && result.status === 'succeeded') {
        // Si une réduction de parrainage a été appliquée, la déduire du solde
        if (appliedDiscount > 0) {
          await deductReferralRewards(appliedDiscount);
        }
        
        setIsPaymentOpen(false);
        setCart([]);
        setDeliveryInfo({ name: "", address: "", phone: "", email: "" });
        setAppliedDiscount(0);
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

  const deductReferralRewards = async (amount) => {
    console.log('💰 ShopPage: Déduction des récompenses utilisées:', amount);
    try {
      // Utiliser le service au lieu de l'appel direct
      const result = await referralService.useRewards(amount);
      console.log('✅ ShopPage: Récompenses déduites avec succès:', result);
      
      // Mettre à jour le solde local avec la réponse du serveur
      setReferralRewards(result.remainingRewards || 0);
      
      // Optionnel: Rafraîchir les stats du widget
      if (window.refreshReferralWidget) {
        window.refreshReferralWidget();
      }
    } catch (err) {
      console.error('❌ ShopPage: Erreur déduction récompenses:', err);
      showNotification('Erreur lors de la déduction des récompenses');
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
      
      {/* Widget de parrainage - Toujours en bas à gauche */}
      {isLoggedIn && (
        <div className="referral-widget-fixed">
          <ReferralWidget />
        </div>
      )}
      
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

          <h3>Filtrer par prix</h3>
          <div style={{ margin: "24px 0 12px 0", width: 180 }}>
            <Slider
              range
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={priceRange}
              onChange={setPriceRange}
              allowCross={false}
              trackStyle={[{ backgroundColor: "#f47b9b" }]}
              handleStyle={[
                { borderColor: "#f47b9b", backgroundColor: "#fff" },
                { borderColor: "#f47b9b", backgroundColor: "#fff" },
              ]}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <span>{priceRange[0]}€</span> — <span>{priceRange[1]}€</span>
          </div>
          <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: "#eabfa2", color: "#3a3937", cursor: "pointer" }}>
            Réinitialiser
          </button>
        </aside>

        <section className="shop-products-section">
          <h2>Nos créations disponibles</h2>
          <div className="shop-products-grid">
            {filteredProductsByPrice.length === 0 && (
              <div className="shop-loading">Aucun produit trouvé.</div>
            )}
            {filteredProductsByPrice.map((product) => (
              <div key={product.id} className="shop-product-card">
                
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
            <div className="shop-cart-modal-content" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
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

                  {/* Section des récompenses de parrainage */}
                  {isLoggedIn && referralRewards > 0 && (
                    <div className="referral-rewards-section">
                      <h4>💰 Récompenses de Parrainage Disponibles</h4>
                      <div className="referral-rewards-info">
                        <span>Solde disponible: <strong>{referralRewards.toFixed(2)}€</strong></span>
                        {!showReferralDiscount ? (
                          <button 
                            className="apply-rewards-btn"
                            onClick={() => setShowReferralDiscount(true)}
                          >
                            🎯 Utiliser mes récompenses
                          </button>
                        ) : (
                          <div className="apply-rewards-form">
                            <p>Montant maximum utilisable: <strong>{Math.min(referralRewards, getSubtotal()).toFixed(2)}€</strong></p>
                            <div className="rewards-buttons">
                              <button 
                                className="confirm-rewards-btn"
                                onClick={handleApplyReferralDiscount}
                              >
                                ✅ Appliquer
                              </button>
                              <button 
                                className="cancel-rewards-btn"
                                onClick={() => setShowReferralDiscount(false)}
                              >
                                ❌ Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Récapitulatif des prix */}
                  <div className="cart-summary">
                    <div className="summary-line">
                      <span>Sous-total:</span>
                      <span>{getSubtotal().toFixed(2)}€</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="summary-line discount-line">
                        <span>
                          🎯 Réduction parrainage
                          <button 
                            className="remove-discount-btn"
                            onClick={handleRemoveReferralDiscount}
                          >
                            ❌
                          </button>
                        </span>
                        <span>-{appliedDiscount.toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="summary-line total-line">
                      <span><strong>Total:</strong></span>
                      <span><strong>{getCartTotal().toFixed(2)}€</strong></span>
                    </div>
                  </div>

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
                    <input
                      type="email"
                      name="email"
                      placeholder="Adresse e-mail"
                      value={isLoggedIn ? userEmail : deliveryInfo.email}
                      onChange={isLoggedIn ? () => {} : handleDeliveryChange}
                      disabled={isLoggedIn}
                      style={{
                        backgroundColor: isLoggedIn ? '#f5f5f5' : 'white',
                        color: isLoggedIn ? '#666' : 'black',
                        cursor: isLoggedIn ? 'not-allowed' : 'text'
                      }}
                    />
                    {isLoggedIn && (
                      <small style={{ color: '#666', fontSize: '0.9rem', marginTop: '-8px', display: 'block' }}>
                        Email automatiquement rempli car vous êtes connecté
                      </small>
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
            <div className="shop-cart-modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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

              {/* Récapitulatif des prix avec réduction */}
              <div style={{ marginBottom: "20px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>Sous-total:</span>
                  <span>{getSubtotal().toFixed(2)}€</span>
                </div>
                {appliedDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#28a745" }}>
                    <span>🎯 Réduction parrainage:</span>
                    <span>-{appliedDiscount.toFixed(2)}€</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "8px" }}>
                  <span>Total:</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>
              </div>

              <div style={{ marginBottom: "20px", padding: "12px", background: "#f9f9f9", borderRadius: "8px" }}>
                <h4>Livraison :</h4>
                <p><strong>Nom :</strong> {deliveryInfo.name}</p>
                <p><strong>Adresse :</strong> {deliveryInfo.address}</p>
                <p><strong>Téléphone :</strong> {deliveryInfo.phone}</p>
                {deliveryInfo.email && <p><strong>Email :</strong> {deliveryInfo.email}</p>}
              </div>

              <button 
                className="shop-checkout-btn" 
                onClick={handlePaymentClick}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Traitement..." : `Payer ${getCartTotal().toFixed(2)}€`}
              </button>
            </div>
          </div>
        )}

        {/* Modal Invité */}
        {isGuestModalOpen && (
          <div className="shop-cart-modal">
            <div className="shop-cart-modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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
};



export default ShopPage;