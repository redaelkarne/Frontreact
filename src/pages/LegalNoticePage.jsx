import React from "react";
import "./LegalNoticePage.css";

function LegalNoticePage() {
  return (
    <div className="legal-container">
      <h1>Mentions légales</h1>

      <h2>1. Éditeur du site</h2>
      <p>
        <strong>Nom de la société :</strong> Audelweiss Craft (par <span className="highlight-pink">Audrey HOSSEPIAN</span>)<br />
        <strong>Email :</strong> contact[@]audelweiss.fr<br />
        <strong>Forme juridique :</strong> Micro entreprise<br />
        <strong>Numéro SIRET :</strong> 83275167100047
      </p>

      <h2>2. Hébergeur du site</h2>
      <p>
        <strong>Nom :</strong> o2switch<br />
        <strong>Adresse :</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand<br />
        <strong>SIRET :</strong> 510 909 807 00032<br />
        <strong>RCS :</strong> Clermont-Ferrand<br />
        <strong>Forme juridique :</strong> SAS au capital de 100 000 €<br />
        <strong>Numéro de téléphone :</strong> 04 44 44 60 40<br />
        <strong>Email :</strong> <a href="mailto:support@o2switch.fr" className="highlight-pink">support@o2switch.fr</a>
      </p>

      <h2>3. Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus présents sur le site audelweiss.fr, incluant, de manière non exhaustive, les textes, images, graphiques, logos, icônes, sons, logiciels, sont la propriété exclusive d’Audelweiss Craft ou de ses partenaires. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord écrit préalable d’Audelweiss Craft.
      </p>

      <h2>4. Données personnelles</h2>
      <p>
        Les informations recueillies sur le site audelweiss.fr sont traitées conformément à notre Politique de Confidentialité. Conformément à la loi “Informatique et Libertés” du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification, de suppression et d’opposition aux données personnelles vous concernant. Pour exercer ces droits, vous pouvez nous contacter à l’adresse email suivante : contact[@]audelweiss.fr.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Le site audelweiss.fr utilise des cookies pour améliorer l’expérience utilisateur, analyser le trafic du site et proposer des publicités ciblées. Vous pouvez configurer votre navigateur pour refuser les cookies ou être informé de leur utilisation. Pour en savoir plus, veuillez consulter notre Politique de Confidentialité.
      </p>

      <h2>6. Limitation de responsabilité</h2>
      <p>
        Audelweiss Craft s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site audelweiss.fr. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, Audelweiss Craft décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige, et après une tentative de recherche de solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.
      </p>
    </div>
  );
}

export default LegalNoticePage;
