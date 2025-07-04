import React, { useState, useEffect } from 'react';
import referralService from '../services/referralService';

const ReferralWidget = () => {
  console.log('🎯 ReferralWidget: Composant rendu');
  
  const [stats, setStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateCode, setShowCreateCode] = useState(false);

  useEffect(() => {
    console.log('🔄 ReferralWidget: useEffect déclenché');
    loadStats();
  }, []);

  const loadStats = async () => {
    console.log('📊 ReferralWidget: Début chargement des statistiques');
    setLoading(true);
    setError('');
    
    try {
      const data = await referralService.getReferralStats();
      console.log('📊 ReferralWidget: Stats reçues:', data);
      setStats(data);
    } catch (err) {
      console.error('❌ ReferralWidget: Erreur chargement stats:', err);
      
      // Gestion plus détaillée des erreurs
      if (err.message.includes('Non authentifié')) {
        setError('Veuillez vous reconnecter');
      } else if (err.message.includes('404')) {
        setError('Service de parrainage indisponible');
      } else {
        setError(err.message || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
      console.log('📊 ReferralWidget: Fin chargement des statistiques');
    }
  };

  const handleCreateCode = async () => {
    console.log('🎯 ReferralWidget: Début création de code');
    setError('');
    
    try {
      const result = await referralService.createReferral();
      console.log('✅ ReferralWidget: Code créé avec succès:', result);
      await loadStats(); // Recharger les stats
      setShowCreateCode(false);
    } catch (err) {
      console.error('❌ ReferralWidget: Erreur création code:', err);
      setError(err.message);
    }
  };

  const copyToClipboard = (text) => {
    console.log('📋 ReferralWidget: Copie dans le presse-papier:', text);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Petit feedback visuel
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✅ Copié !';
          setTimeout(() => {
            if (copyBtn) {
              copyBtn.textContent = originalText;
            }
          }, 2000);
        }
      }).catch(err => {
        console.error('Erreur copie:', err);
        // Fallback pour les anciens navigateurs
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch (fallbackErr) {
          console.error('Fallback copie échoué:', fallbackErr);
        }
      });
    }
  };

  if (loading) {
    console.log('⏳ ReferralWidget: Affichage du loading');
    return (
      <div className="referral-widget loading">
        <div className="referral-header">
          <span>🎯 Parrainage</span>
          <span>⏳</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ ReferralWidget: Affichage de l\'erreur:', error);
    return (
      <div className={`referral-widget error ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className="referral-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>🎯 Parrainage</span>
          <span>❌</span>
        </div>
        {isExpanded && (
          <div className="referral-content">
            <p style={{ color: 'red', fontSize: '0.85rem' }}>
              Erreur: {error}
            </p>
            <button onClick={loadStats} className="retry-btn">
              🔄 Réessayer
            </button>
          </div>
        )}
      </div>
    );
  }

  console.log('🎨 ReferralWidget: Rendu du composant avec stats:', stats);

  return (
    <div className={`referral-widget ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="referral-header"
        onClick={() => {
          console.log('🔄 ReferralWidget: Basculement expanded:', !isExpanded);
          setIsExpanded(!isExpanded);
        }}
      >
        <span>🎯 Parrainage</span>
        <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className="referral-content">
          {/* Section du code de parrainage */}
          <div className="referral-section">
            <h4>🎫 Mon Code</h4>
            {stats?.referralCode ? (
              <div className="referral-code-display">
                <span className="referral-code">{stats.referralCode}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(stats.referralCode)}
                >
                  📋 Copier
                </button>
              </div>
            ) : (
              <div className="no-code">
                <p>Aucun code de parrainage</p>
                {!showCreateCode ? (
                  <button 
                    onClick={() => {
                      console.log('🎯 ReferralWidget: Affichage création de code');
                      setShowCreateCode(true);
                    }}
                    className="create-code-btn"
                  >
                    ✨ Créer mon code
                  </button>
                ) : (
                  <div className="create-code-section">
                    <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                      Créer votre code de parrainage personnel ?
                    </p>
                    <div className="create-code-buttons">
                      <button onClick={handleCreateCode} className="confirm-btn">
                        ✅ Créer
                      </button>
                      <button 
                        onClick={() => setShowCreateCode(false)}
                        className="cancel-btn"
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="referral-stats">
            <div className="stat-item">
              <span className="stat-label">👥 Parrainages</span>
              <span className="stat-value">{stats?.totalReferrals || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">💰 Récompenses</span>
              <span className="stat-value">{stats?.referralRewards || 0}€</span>
            </div>
          </div>

          {/* Informations utiles */}
          <div className="referral-info">
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '8px 0' }}>
              💡 Partagez votre code avec vos amis pour gagner des récompenses !
            </p>
            {stats?.referredBy && (
              <p style={{ fontSize: '0.8rem', color: '#ff6b9d', margin: '4px 0' }}>
                👤 Parrainé par: {stats.referredBy.username}
              </p>
            )}
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralWidget;
