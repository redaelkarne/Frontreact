import React, { useState } from 'react';
import referralService from '../services/referralService';

const UseReferralCode = ({ onCodeUsed }) => {
  console.log('🎫 UseReferralCode: Composant rendu');
  
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 UseReferralCode: Soumission du formulaire');
    console.log('📝 UseReferralCode: Code saisi:', referralCode);
    
    if (!referralCode.trim()) {
      console.warn('⚠️ UseReferralCode: Code vide');
      setError('Veuillez saisir un code de parrainage');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      console.log('🎫 UseReferralCode: Tentative d\'utilisation du code:', referralCode);
      const result = await referralService.useReferralCode(referralCode);
      console.log('✅ UseReferralCode: Code utilisé avec succès:', result);
      
      setMessage(`🎉 Code de parrainage utilisé avec succès ! Vous avez gagné ${result.referral?.rewardAmount || 10}€`);
      setReferralCode('');
      
      // Notifier le parent
      if (onCodeUsed) {
        console.log('📢 UseReferralCode: Notification du parent');
        onCodeUsed(result);
      }
      
    } catch (err) {
      console.error('❌ UseReferralCode: Erreur utilisation code:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🎫 UseReferralCode: Fin tentative utilisation code');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    console.log('✏️ UseReferralCode: Saisie code:', value);
    setReferralCode(value);
    
    // Effacer les messages quand l'utilisateur tape
    if (error) setError('');
    if (message) setMessage('');
  };

  console.log('🎨 UseReferralCode: État actuel:', {
    referralCode,
    loading,
    message,
    error
  });

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      margin: '10px 0',
      backgroundColor: '#f0f8ff'
    }}>
      <h3>🎫 Utiliser un Code de Parrainage</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Code de Parrainage:
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={handleInputChange}
            placeholder="Saisissez le code (ex: ABC123)"
            style={{ 
              padding: '10px', 
              fontSize: '16px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              width: '100%',
              maxWidth: '300px',
              textTransform: 'uppercase'
            }}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading || !referralCode.trim()}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Traitement...' : '🎯 Utiliser le Code'}
        </button>
      </form>

      {/* Messages de succès */}
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724'
        }}>
          {message}
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#e2e3e5', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <p><strong>💡 Comment ça marche :</strong></p>
        <ul>
          <li>Demandez un code à un ami qui utilise déjà la plateforme</li>
          <li>Saisissez le code dans le champ ci-dessus</li>
          <li>Validez pour recevoir votre récompense de bienvenue !</li>
          <li>Vous ne pouvez utiliser qu'un seul code par compte</li>
        </ul>
      </div>
    </div>
  );
};

export default UseReferralCode;
