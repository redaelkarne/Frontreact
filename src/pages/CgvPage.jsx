import React from "react";
import "./CgvPage.css";

function CgvPage() {
  return (
    <div className="cgv-container">
      <h1>Conditions générales de vente</h1>
      <p><strong>Dernière mise à jour : 08/02/2025</strong></p>

      <p>Les présentes Conditions Générales de Vente (CGV) s’appliquent à toutes les commandes passées sur le site audelweiss.fr. En commandant sur notre site, vous acceptez sans réserve les présentes CGV.</p>

      <h2>1. Identification de la société</h2>
      <p>Nom de l’entreprise : Audelweiss Craft<br />
      Email : contact[@]audelweiss.fr<br />
      SIRET : 83275167100047</p>

      <h2>2. Produits proposés</h2>
      <p>Le site propose deux types de produits :</p>
      <ul>
        <li>Produits physiques : Créations artisanales faites à la main, disponibles à l’achat.</li>
        <li>Produits numériques téléchargeables : Modèles ou documents au format numérique (PDF, fichiers crochet, tricot, etc.), téléchargeables immédiatement après le paiement.</li>
      </ul>

      <h2>3. Commande</h2>
      <p>Pour passer une commande, vous devez sélectionner les produits de votre choix et les ajouter au panier, fournir les informations nécessaires (coordonnées de livraison, de facturation, etc.) et valider le paiement de votre commande. Un email de confirmation vous sera envoyé après validation de la commande. Nous nous réservons le droit de refuser ou d’annuler une commande en cas de non-paiement, de litige ou de suspicion de fraude.</p>

      <h2>4. Prix et paiement</h2>
      <p>Les prix sont indiqués en euros (€). Les frais de livraison sont ajoutés au montant de la commande lors de la validation. Le paiement s’effectue via les moyens sécurisés proposés sur le site. Le paiement intégral est requis pour valider la commande.</p>

      <h2>5. Livraison des produits physiques</h2>
      <h3>Modes de livraison</h3>
      <ul>
        <li>Livraison à domicile via Mondial Relay. Si vous êtes absents, le colis sera déposé dans le point relai le plus proche.</li>
        <li>Mondial Relay (livraison en point relais)</li>
        <li>Click & collect à l’atelier (lieu-dit Saint-Jean de Crots 05200)</li>
      </ul>

      <h3>Délais d’expédition</h3>
      <ul>
        <li>Pour les produits nécessitant une création après commande (pas en stock) : l’expédition se fait sous environ 10 jours ouvrés, sauf indication contraire précisée directement sur la fiche produit ou par email au client.</li>
        <li>Pour les produits en stock : l’expédition est garantie sous 5 jours ouvrés après validation du paiement.</li>
      </ul>

      <h3>Délais de livraison</h3>
      <p>Une fois expédiée, la livraison dépend des délais du transporteur choisi (généralement 2 à 5 jours ouvrés). Nous ne pouvons être tenus responsables des retards de livraison dus au transporteur ou à des circonstances exceptionnelles (grèves, intempéries, etc.).</p>

      <h2>6. Produits numériques téléchargeables</h2>
      <p>Les produits numériques commandés sont accessibles immédiatement après confirmation du paiement. Vous recevez un lien de téléchargement dans l’email de confirmation. Conformément à l’article L.221-28 du Code de la consommation, vous renoncez à votre droit de rétractation dès lors que le téléchargement du produit a commencé.</p>
      <p><strong>Restrictions d’utilisation :</strong> Il est interdit de modifier, reproduire, diffuser, partager ou revendre les produits numériques sans l’autorisation écrite préalable d’Audelweiss Craft. Toute utilisation non autorisée expose l’utilisateur à des poursuites judiciaires.</p>

      <h2>7. Droit de rétractation (Produits physiques)</h2>
      <p>Conformément aux dispositions légales, vous disposez d’un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation et demander un remboursement.</p>
      <p><strong>Exceptions :</strong> Le droit de rétractation ne s’applique pas aux produits confectionnés sur mesure ou personnalisés.</p>
      <p>Pour exercer ce droit, vous devez nous contacter à contact@audelweiss.fr en précisant votre numéro de commande. Les produits doivent être retournés en parfait état, dans leur emballage d’origine, à vos frais.</p>

      <h2>8. Responsabilité</h2>
      <p>Audelweiss Craft ne peut être tenue responsable des dommages indirects liés à l’utilisation des produits ou du site. La responsabilité de notre entreprise se limite au montant de la commande.</p>

      <h2>9. Protection des données personnelles</h2>
      <p>Nous collectons vos données personnelles pour traiter vos commandes. Pour plus d’informations sur le traitement de vos données, veuillez consulter notre Politique de confidentialité.</p>

      <h2>10. Propriété intellectuelle</h2>
      <p>Tous les contenus présents sur le site audelweiss.fr sont protégés par le droit d’auteur et restent la propriété exclusive d’Audelweiss Craft. Toute reproduction, modification ou diffusion sans autorisation préalable est interdite.</p>

      <h2>11. Litiges</h2>
      <p>Les présentes CGV sont soumises au droit français. En cas de litige, nous privilégions une solution amiable. À défaut d’accord, le différend sera porté devant les tribunaux compétents du ressort du siège social d’Audelweiss Craft à Gap (05).</p>

      <h2>12. Modification des CGV</h2>
      <p>Nous nous réservons le droit de modifier ces Conditions Générales de Vente à tout moment. Les CGV applicables sont celles en vigueur au moment de la commande.</p>
    </div>
  );
}

export default CgvPage;