import React from "react";
import { Link } from "react-router-dom";
import "./DeliveryPage.css";

function DeliveryPage() {
  return (
    <div className="delivery-container">
      <h1>Livraison</h1>
      <p>Chez <strong>Audelweiss Craft</strong>, chaque création est réalisée avec soin et envoyée avec toute l’attention qu’elle mérite. Voici les options de livraison disponibles :</p>

      <h2>Modes de livraison</h2>
      <h3>📍 Click & Collect (gratuit)</h3>
      <p>Vous habitez dans les Hautes-Alpes ou êtes en vacances dans la région d’Embrun ? Optez pour le Click & Collect et venez récupérer votre commande au Lieu-dit Saint Jean de Crots 05200. Une fois votre commande prête, vous recevrez un e-mail ou un message pour convenir d’un rendez-vous.</p>

      <h3>📦 Livraison en Point Relais (Mondial Relay)</h3>
      <p>Faites livrer votre commande dans un point relais de votre choix.</p>
      <ul>
        <li><strong>Tarif :</strong> entre 6 et 8 € selon le poids du colis.</li>
        <li>Vous sélectionnerez votre point de retrait lors de la commande.</li>
        <li>Un e-mail ou un SMS vous sera envoyé dès que votre colis sera disponible en point relais.</li>
      </ul>

      <h3>🚚 Livraison à domicile – Colissimo</h3>
      <p>Pour une livraison directement chez vous, choisissez Colissimo (service de La Poste).</p>
      <ul>
        <li><strong>Tarif :</strong> entre 9 et 13 € selon le poids du colis.</li>
        <li>Un numéro de suivi vous sera communiqué dès l’expédition.</li>
      </ul>

      <h2>Délai d’expédition et de livraison</h2>
      <ul>
        <li>Chaque commande est traitée sous 3 à 5 jours ouvrés, sauf mention contraire sur la fiche produit.</li>
        <li>Une fois expédié, votre colis est généralement livré sous 48 à 72 heures pour la France métropolitaine.</li>
        <li>Ces délais sont indicatifs et peuvent varier en fonction du transporteur et des périodes de forte affluence (fêtes, grèves, etc.).</li>
      </ul>

      <h2>Livraison à l’étranger</h2>
      <p>Vous souhaitez être livré(e) en dehors de la France ? <Link to="/contact" className="contact-link">Me contacter via le formulaire de contact</Link> avant de passer commande afin d’évaluer les options et les frais de livraison adaptés à votre pays.</p>

      <h2>Suivi et réclamation</h2>
      <ul>
        <li>Un e-mail de confirmation vous sera envoyé dès l’expédition avec un lien de suivi.</li>
        <li>En cas de problème avec votre livraison (retard, perte, colis endommagé), <Link to="/contact" className="contact-link">me contacter via le formulaire de contact dans un délai de 48 heures après réception du colis</Link>.</li>
        <li>Si le colis est retourné à l’expéditeur (adresse incorrecte, non-récupération en point relais), un nouvel envoi pourra être effectué à vos frais.</li>
      </ul>

      <h2>Retours et droit de rétractation</h2>
      <ul>
        <li>Conformément à <strong>l’article L.221-18 du Code de la consommation</strong>, vous disposez d’un droit de rétractation de 14 jours après réception du colis (sauf exceptions pour les produits personnalisés).</li>
        <li>Les frais de retour sont à la charge du client.</li>
        <li>Pour toute demande de retour, <Link to="/contact" className="contact-link">me contacter via le formulaire de contact</Link> en précisant votre numéro de commande et la raison du retour.</li>
      </ul>

      <h2>Mentions légales</h2>
      <ul>
        <li>Les frais de livraison incluent les frais de transport ainsi que l’emballage.</li>
        <li>Je ne peux être tenue responsable des retards liés aux transporteurs ou aux événements extérieurs (intempéries, grèves, etc.).</li>
      </ul>

      <p>Pour toute question, <Link to="/contact" className="contact-link">me contacter via le formulaire de contact</Link>.</p>
    </div>
  );
}

export default DeliveryPage;
