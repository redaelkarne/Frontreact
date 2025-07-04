import React, { useState } from "react";
import "./FaqPage.css";

function FaqPage() {
  const faqs = [
    {
      question: "Quelles sont les particularités des créations Audelweiss Craft ?",
      answer:
        "Toutes mes pièces sont faites à la main dans les Hautes-Alpes, avec une attention particulière aux détails et à la qualité. J’utilise des matériaux sélectionnés avec soin et, en tant que praticienne Reiki, je me connecte à cette énergie pour insuffler une intention positive dans chaque création.",
    },
    {
      question: "Quels types de produits proposez-vous ?",
      answer:
        "Je propose des créations artisanales en crochet, des articles textiles personnalisés et des produits bien-être conçus avec soin.",
    },
    {
      question: "Puis-je commander un article personnalisé ?",
      answer:
        "Oui, vous pouvez demander des personnalisations sur mesure selon vos besoins et envies via le formulaire de contact.",
    },
    {
      question: "Quels éléments puis-je personnaliser ?",
      answer:
        "Vous pouvez personnaliser les couleurs, les tailles et ajouter des prénoms ou messages selon le produit choisi.",
    },
    {
      question: "Quels sont les délais de fabrication et d’expédition ?",
      answer:
        "Les délais de fabrication varient de 3 à 10 jours selon le produit, auxquels s'ajoutent les délais de livraison habituels selon le transporteur choisi.",
    },
    {
      question: "Expédiez-vous à l’international ?",
      answer:
        "Oui, l'expédition à l'international est possible après contact pour ajuster les frais selon votre localisation.",
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer:
        "Les paiements par carte bancaire, PayPal et virements bancaires sont acceptés sur la boutique en ligne.",
    },
    {
      question: "Puis-je retourner un article ?",
      answer:
        "Vous disposez d'un délai de 14 jours après réception pour exercer votre droit de rétractation, sauf exceptions pour les produits personnalisés.",
    },
    {
      question: "Comment entretenir mes articles en crochet ?",
      answer:
        "Il est conseillé de laver les articles en crochet à la main avec de l'eau tiède et de les sécher à plat pour préserver leur forme.",
    },
    {
      question: "Les impressions en vinyle textile résistent-elles au lavage ?",
      answer:
        "Oui, il est recommandé de laver les textiles imprimés à l’envers à 30°C et de ne pas utiliser de sèche-linge pour prolonger la durée de vie des impressions.",
    },
    {
      question: "Comment vous contacter ?",
      answer:
        "Vous pouvez me contacter via le formulaire de contact disponible sur le site pour toute question ou demande de personnalisation.",
    },
    {
      question: "Proposez-vous des cartes cadeaux ?",
      answer:
        "Oui, des cartes cadeaux sont disponibles sur demande pour offrir une création personnalisée à vos proches.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1>FAQ</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-question"
            onClick={() => toggleFaq(index)}
          >
            {faq.question}
          </button>
          {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default FaqPage;
