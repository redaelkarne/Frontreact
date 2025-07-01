import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
      return;
    }

    try {
      // 1. D'abord récupérer l'utilisateur connecté
      const userEmail = await getCurrentUserEmail();
      if (!userEmail) {
        setError('Impossible de récupérer vos informations utilisateur');
        setLoading(false);
        return;
      }

      setCurrentUserEmail(userEmail);
      console.log('Email de l\'utilisateur connecté:', userEmail);

      // 2. Ensuite récupérer ses commandes
      await fetchUserOrders(userEmail);

    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err);
      setError('Erreur lors du chargement de la page');
      setLoading(false);
    }
  };

  const getCurrentUserEmail = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await fetch('http://localhost:1337/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('Données utilisateur récupérées:', userData);
      
      if (!userData.email) {
        throw new Error('Email utilisateur non trouvé');
      }

      return userData.email;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'email utilisateur:', err);
      throw err;
    }
  };

  const fetchUserOrders = async (userEmail) => {
    const jwt = localStorage.getItem('jwt');
    try {
      // Construire l'URL avec le filtre email
      const filterUrl = `http://localhost:1337/api/commandes?filters[email][$eq]=${encodeURIComponent(userEmail)}`;
      console.log('URL de requête:', filterUrl);

      const response = await fetch(filterUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Données brutes des commandes:', data);

      // Vérifier la structure des données
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('Structure de données inattendue:', data);
        setOrders([]);
        calculateStats([]);
        return;
      }

      // Transformer les données - CORRIGER LE NOM DU CHAMP STATUT
      const transformedOrders = data.data.map((order) => {
        console.log('Données de commande brute:', order);
        console.log('Statut récupéré:', order.Statut); // Debug pour voir le statut

        return {
          id: order.id,
          orderNumber: `#CMD-${order.id}`,
          date: order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Date non disponible',
          rawDate: order.createdAt,
          status: order.Statut || 'En attente', // Utiliser Statut avec S majuscule
          total: order.total || 0,
          totalFormatted: `${(order.total || 0).toFixed(2)} €`,
          items: order.items || [],
          customerInfo: {
            name: order.name || 'Non spécifié',
            email: order.email || userEmail,
            phone: order.phone || 'Non spécifié',
            address: order.address || 'Non spécifiée'
          }
        };
      });

      console.log('Commandes transformées:', transformedOrders);

      // Trier par date (plus récent en premier)
      transformedOrders.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

      setOrders(transformedOrders);
      calculateStats(transformedOrders);

    } catch (err) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError(`Erreur lors du chargement des commandes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalSpent = ordersData.reduce((sum, order) => sum + order.total, 0);
    // Adapter les statuts en cours selon vos vraies valeurs de statut
    const pendingOrders = ordersData.filter(order => 
      order.status === 'En cours' || 
      order.status === 'En attente' || 
      order.status === 'Expédié' ||
      order.status === 'Préparation'
    ).length;

    setStats({
      totalOrders,
      totalSpent: totalSpent.toFixed(2),
      pendingOrders
    });

    console.log('Statistiques calculées:', { totalOrders, totalSpent, pendingOrders });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    // Nettoyer le statut (enlever les espaces)
    const cleanStatus = status?.trim();
    
    switch (cleanStatus) {
      case 'Livré':
      case 'Livree':
        return 'status-delivered';
      case 'En cours':
      case 'En attente':
      case 'Préparation':
      case 'Preparation':
        return 'status-processing';
      case 'Expédié':
      case 'Expedie':
      case 'Expédiée':
      case 'En Livraison': // Ajouter le nouveau statut
        return 'status-shipped';
      case 'Annulé':
      case 'Annule':
      case 'Annulée':
        return 'status-cancelled';
      default:
        return 'status-processing';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading-message">
            <p>Chargement de vos commandes...</p>
            <small>Email: {currentUserEmail}</small>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="error-message">
            <h3>Erreur</h3>
            <p>{error}</p>
            <button onClick={initializePage} className="retry-btn">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>Mes Commandes</h1>
          <p>Commandes pour: <strong>{currentUserEmail}</strong></p>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.totalOrders}</span>
            <span className="stat-label">Commandes totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalSpent} €</span>
            <span className="stat-label">Total dépensé</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.pendingOrders}</span>
            <span className="stat-label">En cours</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>Aucune commande trouvée</h3>
            <p>Vous n'avez pas encore passé de commande avec l'email: <strong>{currentUserEmail}</strong></p>
            <p>Vos commandes apparaîtront ici une fois que vous aurez effectué un achat.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                  <div className="order-info">
                    <h3>{order.orderNumber}</h3>
                    <p className="order-date">{order.date}</p>
                    <p className="order-customer">Client: {order.customerInfo.name}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-total">
                    <span>{order.totalFormatted}</span>
                  </div>
                  <div className="order-toggle">
                    <span className={`toggle-icon ${expandedOrder === order.id ? 'rotated' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <div className="order-shipping-info">
                      <h4>Informations de livraison :</h4>
                      <div className="info-grid">
                        <p><strong>Nom:</strong> {order.customerInfo.name}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Téléphone:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Adresse:</strong> {order.customerInfo.address}</p>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      <h4>Articles commandés :</h4>
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <div className="items-list">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">
                                {item.name || item.title || `Article ${index + 1}`}
                              </span>
                              <span className="item-quantity">
                                Qté: {item.quantity || 1}
                              </span>
                              <span className="item-price">
                                {item.price ? `${item.price} €` : 'Prix non spécifié'}
                              </span>
                            </div>
                          ))}
                          <div className="items-total">
                            <strong>Total des articles: {order.totalFormatted}</strong>
                          </div>
                        </div>
                      ) : (
                        <p className="no-items">Détails des articles non disponibles</p>
                      )}
                    </div>
                    
                    <div className="order-actions">
                      <button className="action-btn primary">Voir les détails complets</button>
                      <button className="action-btn secondary">Contacter le support</button>
                      {order.status === 'Livré' && (
                        <button className="action-btn secondary">Laisser un avis</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="orders-footer">
          <button className="load-more-btn" onClick={initializePage}>
            Actualiser les commandes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

