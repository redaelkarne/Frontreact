import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Récupérer les détails de la commande depuis localStorage
      const pendingOrder = localStorage.getItem('pendingOrder');
      if (pendingOrder) {
        const orderData = JSON.parse(pendingOrder);
        setOrderDetails(orderData);
        
        // Nettoyer localStorage
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('cart');
      }
    } else {
      // Pas de session_id, rediriger vers la boutique
      navigate('/shop');
    }
  }, [searchParams, navigate]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', color: '#4caf50', marginBottom: '20px' }}>
          ✅
        </div>
        
        <h1 style={{ color: '#333', marginBottom: '16px' }}>
          Paiement réussi !
        </h1>
        
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
          Merci pour votre commande. Votre paiement a été traité avec succès.
        </p>

        {orderDetails && (
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Détails de votre commande :</h3>
            <p><strong>Nom :</strong> {orderDetails.deliveryInfo.name}</p>
            <p><strong>Adresse :</strong> {orderDetails.deliveryInfo.address}</p>
            <p><strong>Téléphone :</strong> {orderDetails.deliveryInfo.phone}</p>
            {orderDetails.deliveryInfo.email && (
              <p><strong>Email :</strong> {orderDetails.deliveryInfo.email}</p>
            )}
            
            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Articles commandés :</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {orderDetails.cart.map((item, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  {item.name} x {item.quantity} - {(item.price * item.quantity).toFixed(2)}€
                </li>
              ))}
            </ul>
            
            <p style={{ 
              marginTop: '20px', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Total : {orderDetails.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={handleContinueShopping}
            style={{
              background: '#ff6b9d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Continuer mes achats
          </button>
          
          <button
            onClick={handleGoHome}
            style={{
              background: '#d4a574',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
