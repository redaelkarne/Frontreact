const API_URL = 'http://localhost:1337/api';

class ReferralService {
  constructor() {
    console.log('🎯 ReferralService: Service initialisé');
  }

  // Récupérer le token d'authentification
  getAuthToken() {
    const token = localStorage.getItem('jwt');
    console.log('🔑 ReferralService: Token récupéré:', token ? 'Token présent' : 'Aucun token');
    return token;
  }

  // Créer un code de parrainage
  async createReferral(referralCode = null) {
    console.log('📝 ReferralService: Début création code de parrainage');
    console.log('📝 ReferralService: Code fourni:', referralCode);
    
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('❌ ReferralService: Aucun token d\'authentification');
        throw new Error('Non authentifié');
      }

      const requestBody = referralCode ? { referralCode } : {};
      console.log('📝 ReferralService: Corps de la requête:', requestBody);

      const response = await fetch(`${API_URL}/referrals/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📝 ReferralService: Statut de la réponse:', response.status);
      
      const data = await response.json();
      console.log('📝 ReferralService: Données de réponse:', data);

      if (!response.ok) {
        console.error('❌ ReferralService: Erreur API:', data);
        throw new Error(data.error?.message || 'Erreur lors de la création');
      }

      console.log('✅ ReferralService: Code de parrainage créé avec succès');
      return data;
    } catch (error) {
      console.error('❌ ReferralService: Erreur création:', error);
      throw error;
    }
  }

  // Utiliser un code de parrainage
  async useReferralCode(referralCode) {
    console.log('🎫 ReferralService: Début utilisation code de parrainage');
    console.log('🎫 ReferralService: Code à utiliser:', referralCode);
    
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('❌ ReferralService: Aucun token d\'authentification');
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/referrals/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ referralCode })
      });

      console.log('🎫 ReferralService: Statut de la réponse:', response.status);
      
      const data = await response.json();
      console.log('🎫 ReferralService: Données de réponse:', data);

      if (!response.ok) {
        console.error('❌ ReferralService: Erreur API:', data);
        
        // Gestion spécifique des erreurs Strapi
        let errorMessage = 'Erreur lors de l\'utilisation du code';
        
        if (data.error) {
          if (data.error.message.includes('unique')) {
            errorMessage = 'Vous avez déjà été parrainé';
          } else if (data.error.message.includes('invalide') || data.error.message.includes('invalid')) {
            errorMessage = 'Code de parrainage invalide';
          } else if (data.error.message.includes('vous ne pouvez pas')) {
            errorMessage = 'Vous ne pouvez pas utiliser votre propre code';
          } else {
            errorMessage = data.error.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ ReferralService: Code de parrainage utilisé avec succès');
      return data;
    } catch (error) {
      console.error('❌ ReferralService: Erreur utilisation:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de parrainage
  async getReferralStats() {
    console.log('📊 ReferralService: Début récupération statistiques');
    
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('❌ ReferralService: Aucun token d\'authentification');
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/referrals/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 ReferralService: Statut de la réponse:', response.status);
      
      const data = await response.json();
      console.log('📊 ReferralService: Statistiques récupérées:', data);

      if (!response.ok) {
        console.error('❌ ReferralService: Erreur API:', data);
        throw new Error(data.error?.message || 'Erreur lors de la récupération des stats');
      }

      console.log('✅ ReferralService: Statistiques récupérées avec succès');
      console.log('📊 ReferralService: Détail des stats:');
      console.log('  - Code de parrainage:', data.referralCode);
      console.log('  - Total parrainages:', data.totalReferrals);
      console.log('  - Récompenses:', data.referralRewards);
      console.log('  - Parrainages effectués:', data.referralsMade?.length || 0);
      console.log('  - Parrainé par:', data.referredBy?.username || 'Aucun');
      
      return data;
    } catch (error) {
      console.error('❌ ReferralService: Erreur récupération stats:', error);
      throw error;
    }
  }
}

export default new ReferralService();
