import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="global-footer">
      <div className="footer-top">
        <div className="footer-help">
          <h3>Besoin d'aide ?</h3>
          <ul>
            <li>
            <Link to="/resellers" style={{ textDecoration: 'none', color: 'inherit' }}>
              Points de vente physiques
            </Link>
            </li>
            <li>
              <Link to="/livraison" style={{ textDecoration: 'none', color: 'inherit' }}>
                Livraison
              </Link>
            </li>
            <li>
              <Link to="/faq" style={{ textDecoration: 'none', color: 'inherit' }}>Foire aux questions</Link>
            </li>

            <li>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                Me contacter
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-logo">
          <img src="https://audelweiss.fr/wp-content/uploads/2025/02/logo-blanc.svg" alt="Logo Audelweiss" style={{ width: '180px', height: 'auto' }} />
          <p>
            Chaque pièce est imaginée et réalisée à la main dans les Hautes-Alpes, avec passion et créativité. Un mélange d'authenticité, d'expérimentation et d'énergie positive pour apporter douceur et harmonie à votre quotidien.
            <br /><br />
            Retrouvez-moi sur Instagram pour suivre les actus 🐚✨
          </p>
          <div className="footer-socials">
            <a className="footer-social-icon" href="https://www.instagram.com/audelweiss.craft/" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a className="footer-social-icon" href="https://www.tiktok.com/@audelweiss.craft" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
                <path d="M41.5 15.5c-3.6 0-6.5-2.9-6.5-6.5h-4.5v24.2c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.5 0 1 .1 1.5.3v-4.2c-.5-.1-1-.1-1.5-.1-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3 8.3-3.7 8.3-8.3V21.7c2 1.2 4.3 1.8 6.7 1.8v-4z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h3>Liens utiles</h3>
          <ul>
            <li>
              <Link to="/cgv" style={{ textDecoration: 'none', color: 'inherit' }}>CGV</Link>
            </li>

            <li>
              <Link to="/mentions-legales" style={{ textDecoration: 'none', color: 'inherit' }}>Mentions légales</Link>
            </li>

            <li>
              <Link to="/politique-confidentialite" style={{ textDecoration: 'none', color: 'inherit' }}>Politique de confidentialité</Link>
            </li>

          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        2025 © AUDELWEISS Craft – Site réalisé par <a href="#">Audrey HOSSEPIAN</a>
      </div>
    </footer>
  );
};

export default Footer;
  