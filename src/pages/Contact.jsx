import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Configuration EmailJS - Clés réelles
  const EMAIL_SERVICE_ID = 'service_wkut7lm';
  const EMAIL_TEMPLATE_ID = 'template_ou5c6mq';
  const EMAIL_PUBLIC_KEY = 'N94qpq4QnW6a_wpft';

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mapper les noms des champs EmailJS vers les clés du state
    const fieldMap = {
      'from_name': 'name',
      'from_email': 'email',
      'subject': 'subject',
      'message': 'message'
    };
    
    const stateKey = fieldMap[name] || name;
    
    setFormData({
      ...formData,
      [stateKey]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Paramètres explicites pour EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Audrey',
        to_email: 'elkarnereda@gmail.com',
        reply_to: formData.email
      };

      // Envoi avec emailjs.send() et paramètres explicites
      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams,
        EMAIL_PUBLIC_KEY
      );

      console.log('Email envoyé avec succès:', response);
      setSubmitStatus('success');
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      console.error('Détails de l\'erreur:', error.text);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Réinitialiser le status après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contactez-moi</h1>
          <p>Une question, une commande personnalisée ou simplement envie d'échanger ? N'hésitez pas à me contacter !</p>
        </div>
        <div className="contact-hero-image">
          <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80" alt="Contact" />
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Formulaire de contact */}
          <div className="contact-form-section">
            <h2>Envoyez-moi un message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="from_email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="personnalisation">Demande de personnalisation</option>
                  <option value="partenariat">Partenariat/Collaboration</option>
                  <option value="technique">Question technique</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Décrivez votre demande en détail..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>

              {submitStatus === 'success' && (
                <div className="submit-success">
                  ✅ Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="submit-error">
                  ❌ Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou me contacter directement.
                </div>
              )}
            </form>
          </div>

          {/* Informations de contact */}
          <div className="contact-info-section">
            <h2>Informations de contact</h2>
            
            <div className="contact-info-card">
              <div className="contact-info-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>audrey@audelweiss.fr</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h3>Téléphone</h3>
                  <p>+33 6 12 34 56 78</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Localisation</h3>
                  <p>Embrun, Hautes-Alpes<br />France</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">⏰</div>
                <div>
                  <h3>Horaires</h3>
                  <p>Lun - Ven : 9h - 18h<br />Sam : 9h - 16h</p>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="social-section">
              <h3>Suivez-moi</h3>
              <div className="social-links">
                <a href="#" className="social-link instagram">
                  <span>📷</span> Instagram
                </a>
                <a href="#" className="social-link facebook">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="social-link pinterest">
                  <span>📌</span> Pinterest
                </a>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="faq-section">
              <h3>Questions fréquentes</h3>
              <div className="faq-item">
                <h4>💝 Commandes personnalisées</h4>
                <p>Délai moyen : 2-3 semaines selon la complexité</p>
              </div>
              <div className="faq-item">
                <h4>🚚 Livraison</h4>
                <p>France métropolitaine : 3-5 jours ouvrés</p>
              </div>
              <div className="faq-item">
                <h4>💳 Paiement</h4>
                <p>CB, PayPal, virement bancaire acceptés</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section carte */}
      <section className="map-section">
        <h2>Où me trouver ?</h2>
        <div className="map-container">
          <div className="map-placeholder">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" 
              alt="Hautes-Alpes" 
            />
            <div className="map-overlay">
              <div className="location-pin">📍</div>
              <p>Embrun, Hautes-Alpes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};



export default Contact;
