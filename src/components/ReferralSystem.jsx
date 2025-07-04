import React, { useState, useEffect } from 'react';
import ReferralStats from './ReferralStats';
import UseReferralCode from './UseReferralCode';

const ReferralSystem = () => {
  console.log('🎯 ReferralSystem: Composant principal rendu');
  
  const [activeTab, setActiveTab] = useState('stats');
  const [userStats, setUserStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    console.log('🔄 ReferralSystem: Composant monté, activeTab:', activeTab);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    console.log('📑 ReferralSystem: Changement d\'onglet vers:', tab);
    setActiveTab(tab);
  };

  const handleStatsUpdate = (stats) => {
    console.log('📊 ReferralSystem: Mise à jour des stats reçue:', stats);
    setUserStats(stats);
  };

  const handleCodeUsed = (result) => {
    console.log('🎉 ReferralSystem: Code utilisé avec succès:', result);
    
    // Forcer le rafraîchissement des stats
    console.log('🔄 ReferralSystem: Déclenchement du rafraîchissement des stats');
    setRefreshKey(prev => prev + 1);
    
    // Optionnel: changer d'onglet pour voir les stats
    console.log('📑 ReferralSystem: Basculement vers l\'onglet stats');
    setActiveTab('stats');
  };

  console.log('🎨 ReferralSystem: État actuel:', {
    activeTab,
    userStats: userStats ? 'Présent' : 'Absent',
    refreshKey
  });

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        🎯 Système de Parrainage
      </h2>

      {/* Navigation par onglets */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px',
        borderBottom: '2px solid #eee'
      }}>
        <button
          onClick={() => handleTabChange('stats')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'stats' ? '#007bff' : 'transparent',
            color: activeTab === 'stats' ? 'white' : '#007bff',
            border: 'none',
            borderBottom: activeTab === 'stats' ? '3px solid #007bff' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          📊 Mes Statistiques
        </button>
        
        <button
          onClick={() => handleTabChange('use')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'use' ? '#28a745' : 'transparent',
            color: activeTab === 'use' ? 'white' : '#28a745',
            border: 'none',
            borderBottom: activeTab === 'use' ? '3px solid #28a745' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🎫 Utiliser un Code
        </button>
      </div>

      {/* Informations générales */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
          💡 À propos du système de parrainage
        </h4>
        <p style={{ margin: '0', color: '#6c757d', lineHeight: '1.5' }}>
          Parrainez vos amis et gagnez des récompenses ! Chaque parrainage réussi vous rapporte 10€.
          Vos amis reçoivent également une récompense de bienvenue.
        </p>
      </div>

      {/* Contenu des onglets */}
      <div>
        {activeTab === 'stats' && (
          <div>
            <console.log key={refreshKey}>
              🔄 ReferralSystem: Rendu de l'onglet stats avec refreshKey: {refreshKey}
            </console.log>
            <ReferralStats 
              key={refreshKey}
              onStatsUpdate={handleStatsUpdate} 
            />
          </div>
        )}
        
        {activeTab === 'use' && (
          <div>
            <console.log>
              🎫 ReferralSystem: Rendu de l'onglet utilisation de code
            </console.log>
            <UseReferralCode onCodeUsed={handleCodeUsed} />
          </div>
        )}
      </div>

      {/* Résumé rapide si des stats sont disponibles */}
      {userStats && activeTab === 'use' && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f4f8',
          borderRadius: '8px',
          border: '1px solid #bee5eb'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
            📈 Votre Résumé Rapide
          </h4>
          <p style={{ margin: '5px 0', color: '#0c5460' }}>
            🎫 Votre code: <strong>{userStats.referralCode || 'Aucun'}</strong>
          </p>
          <p style={{ margin: '5px 0', color: '#0c5460' }}>
            👥 Parrainages réussis: <strong>{userStats.totalReferrals || 0}</strong>
          </p>
          <p style={{ margin: '5px 0', color: '#0c5460' }}>
            💰 Récompenses gagnées: <strong>{userStats.referralRewards || 0}€</strong>
          </p>
        </div>
      )}

      {/* Debug info (à supprimer en production) */}
      <div style={{ 
        marginTop: '30px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6c757d',
        border: '1px solid #dee2e6'
      }}>
        <strong>🔧 Debug Info (à supprimer en production):</strong><br/>
        Onglet actif: {activeTab}<br/>
        RefreshKey: {refreshKey}<br/>
        Stats utilisateur: {userStats ? 'Chargées' : 'Non chargées'}<br/>
        Timestamp: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ReferralSystem;
