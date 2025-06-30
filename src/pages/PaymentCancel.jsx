import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    // Restaurer le panier si l'utilisateur annule
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const orderData = JSON.parse(pendingOrder);
      localStorage.setItem('cart', JSON.stringify(orderData.cart));
      localStorage.removeItem('pendingOrder');
    }
  }, []);

  const handleReturnToCart = () => {
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
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ fontSize: '4rem', color: '#ff6b9d', marginBottom: '20px' }}>
          ❌
        </div>
        
        <h1 style={{ color: '#333', marginBottom: '16px' }}>
          Paiement annulé
        </h1>
        
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '30px' }}>
          Votre paiement a été annulé. Vos articles ont été restaurés dans votre panier.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={handleReturnToCart}
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
            Retour au panier
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
