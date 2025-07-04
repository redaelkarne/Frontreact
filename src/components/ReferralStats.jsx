import React, { useState, useEffect } from 'react';
import referralService from '../services/referralService';

const ReferralStats = ({ onStatsUpdate }) => {
  console.log('🏁 ReferralStats: Composant rendu');
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  // Charger les statistiques au montage du composant
  useEffect(() => {
    console.log('🔄 ReferralStats: useEffect déclenché - chargement des stats');
    loadStats();
  }, []);

  const loadStats = async () => {
    console.log('📊 ReferralStats: Début chargement des statistiques');
    setLoading(true);
    setError('');
    
    try {
      const data = await referralService.getReferralStats();
      console.log('📊 ReferralStats: Stats reçues:', data);
      setStats(data);
      
      // Notifier le parent si nécessaire
      if (onStatsUpdate) {
        console.log('📊 ReferralStats: Notification du parent avec les stats');
        onStatsUpdate(data);
      }
    } catch (err) {
      console.error('❌ ReferralStats: Erreur chargement stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('📊 ReferralStats: Fin chargement des statistiques');
    }
  };

  const handleCreateCode = async () => {
    console.log('🎯 ReferralStats: Début création de code personnalisé');
    console.log('🎯 ReferralStats: Code personnalisé saisi:', customCode);
    
    setIsCreatingCode(true);
    setError('');
    
    try {
      const result = await referralService.createReferral(customCode || null);
      console.log('✅ ReferralStats: Code créé avec succès:', result);
      
      // Recharger les stats après création
      console.log('🔄 ReferralStats: Rechargement des stats après création');
      await loadStats();
      setCustomCode('');
    } catch (err) {
      console.error('❌ ReferralStats: Erreur création code:', err);
      setError(err.message);
    } finally {
      setIsCreatingCode(false);
      console.log('🎯 ReferralStats: Fin création de code');
    }
  };

  const copyToClipboard = (text) => {
    console.log('📋 ReferralStats: Copie dans le presse-papier:', text);
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    console.log('⏳ ReferralStats: Affichage du loading');
    return <div style={{ padding: '20px' }}>Chargement des statistiques...</div>;
  }

  if (error) {
    console.log('❌ ReferralStats: Affichage de l\'erreur:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Erreur: {error}</p>
        <button onClick={loadStats}>Réessayer</button>
      </div>
    );
  }

  console.log('🎨 ReferralStats: Rendu du composant avec stats:', stats);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      margin: '10px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>📊 Mes Statistiques de Parrainage</h3>
      
      {/* Section du code de parrainage */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '5px' }}>
        <h4>🎫 Mon Code de Parrainage</h4>
        {stats?.referralCode ? (
          <div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c5aa0' }}>
              {stats.referralCode}
              <button 
                onClick={() => copyToClipboard(stats.referralCode)}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
              >
                📋 Copier
              </button>
            </p>
          </div>
        ) : (
          <div>
            <p>Vous n'avez pas encore de code de parrainage.</p>
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Code personnalisé (optionnel)"
                value={customCode}
                onChange={(e) => {
                  console.log('✏️ ReferralStats: Saisie code personnalisé:', e.target.value);
                  setCustomCode(e.target.value);
                }}
                style={{ padding: '5px', marginRight: '10px' }}
              />
              <button 
                onClick={handleCreateCode}
                disabled={isCreatingCode}
                style={{ padding: '5px 15px' }}
              >
                {isCreatingCode ? 'Création...' : '🎯 Créer mon code'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques générales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
          <h4>👥 Total Parrainages</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a2d' }}>
            {stats?.totalReferrals || 0}
          </p>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
          <h4>💰 Récompenses Gagnées</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
            {stats?.referralRewards || 0}€
          </p>
        </div>
      </div>

      {/* Informations sur qui vous a parrainé */}
      {stats?.referredBy && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>
          <h4>👤 Parrainé par</h4>
          <p>Utilisateur: {stats.referredBy.username}</p>
          <p>Email: {stats.referredBy.email}</p>
        </div>
      )}

      {/* Liste des personnes parrainées */}
      {stats?.referralsMade && stats.referralsMade.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>🎯 Mes Parrainages ({stats.referralsMade.length})</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {stats.referralsMade.map((referral, index) => {
              console.log(`👥 ReferralStats: Affichage parrainage ${index + 1}:`, referral);
              return (
                <div key={referral.id} style={{ 
                  padding: '10px', 
                  margin: '5px 0', 
                  backgroundColor: '#fff', 
                  borderRadius: '3px',
                  border: '1px solid #eee'
                }}>
                  <p>✅ {referral.referred?.username || 'Utilisateur'}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Récompense: {referral.rewardAmount || 10}€ - 
                    Date: {new Date(referral.completedAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button 
        onClick={loadStats}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🔄 Actualiser
      </button>
    </div>
  );
};

export default ReferralStats;
