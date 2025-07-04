import React from "react";
import "./PrivacyPolicyPage.css";

function PrivacyPolicyPage() {
  return (
    <div className="privacy-container">
      <h1>Politique de confidentialité</h1>

      <p><strong>Dernière mise à jour : 08/02/2025</strong></p>

      <p>
        La présente politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site <a href="https://audelweiss.fr" target="_blank" rel="noopener noreferrer">https://audelweiss.fr</a>, incluant la boutique en ligne, le blog et la newsletter.
      </p>

      <h2>1. Responsable du traitement des données</h2>
      <p>
        Le responsable du traitement des données personnelles est :<br />
        Nom : <span className="highlight-pink">Audrey HOSSEPIAN</span><br />
        Email de contact : contact[@]audelweiss.fr
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons différents types de données personnelles, selon vos interactions avec le site :</p>
      <ul>
        <li>Lors de l’achat sur la boutique en ligne : nom, prénom, adresse de livraison, adresse email, numéro de téléphone, informations de paiement (gérées par un prestataire tiers sécurisé).</li>
        <li>Pour la newsletter : prénom et adresse email.</li>
        <li>Pour les commentaires sur le blog : nom (ou pseudo), adresse email, contenu du commentaire.</li>
        <li>Analyses de trafic : données anonymisées collectées via Google Analytics (adresse IP anonymisée, pages visitées, temps de visite, etc.).</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <p>Vos données sont collectées pour les raisons suivantes :</p>
      <ul>
        <li>Traitement et suivi des commandes sur la boutique en ligne.</li>
        <li>Envoi d’informations et d’offres via la newsletter, si vous y avez consenti.</li>
        <li>Gestion des commentaires sur le blog.</li>
        <li>Analyse de la fréquentation du site via Google Analytics afin d’améliorer l’expérience utilisateur et les performances du site.</li>
        <li>Réponses aux demandes envoyées via les formulaires de contact.</li>
      </ul>

      <h2>4. Partage des données</h2>
      <p>Nous ne vendons ni ne partageons vos données personnelles avec des tiers. Toutefois, certaines données peuvent être transférées aux prestataires suivants :</p>
      <ul>
        <li>Brevo (anciennement Sendinblue) pour la gestion de la newsletter.</li>
        <li>Google Analytics pour les analyses de trafic (données anonymisées).</li>
      </ul>

      <h2>5. Durée de conservation des données</h2>
      <p>Les données personnelles sont conservées pendant les durées suivantes :</p>
      <ul>
        <li>Données relatives aux commandes : conservation pendant la durée légale de 5 ans à des fins comptables.</li>
        <li>Données de contact et d’abonnement à la newsletter : 3 ans après la dernière interaction (ou jusqu’à ce que vous vous désinscriviez).</li>
        <li>Données des commentaires du blog : conservées tant que le commentaire reste visible sur le site.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
      <ul>
        <li>Droit d’accès : vous pouvez demander à consulter les données vous concernant.</li>
        <li>Droit de rectification : vous pouvez demander la correction de données inexactes.</li>
        <li>Droit à l’effacement : vous pouvez demander la suppression de vos données personnelles.</li>
        <li>Droit d’opposition : vous pouvez vous opposer au traitement de vos données, notamment pour l’envoi de newsletters.</li>
        <li>Droit à la portabilité : vous pouvez demander à recevoir vos données sous un format lisible par machine.</li>
      </ul>
      <p>Pour exercer ces droits, vous pouvez nous contacter à contact[@]audelweiss.fr</p>

      <h2>7. Sécurité des données</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données contre tout accès non autorisé, perte, destruction ou modification.</p>

      <h2>8. Cookies et suivi</h2>
      <p>Nous utilisons des cookies pour améliorer votre expérience sur le site, personnaliser le contenu et analyser notre trafic. Vous pouvez gérer vos préférences de cookies via le bandeau de consentement qui apparaît lors de votre première visite. Les cookies utilisés incluent notamment ceux de :</p>
      <ul>
        <li>Google Analytics (analyse du trafic).</li>
        <li>Cookies nécessaires au bon fonctionnement du site (panier, connexion au compte, etc.).</li>
      </ul>

      <h2>9. Modifications de la politique de confidentialité</h2>
      <p>Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. En cas de modification importante, vous serez informé(e) par email ou par un message sur le site.</p>

      <h2>10. Contact</h2>
      <p>Pour toute question relative à cette politique de confidentialité ou au traitement de vos données personnelles, vous pouvez nous contacter :<br />
      Email : contact[@]audelweiss.fr</p>
    </div>
  );
}

export default PrivacyPolicyPage;
