import React from 'react';
import { Globe, Share2, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer({ setCurrentView }) {
  const { shopSettings } = useSettings();
  
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-bio">
          <a 
            href="#" 
            className="logo-link"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('home');
            }}
          >
            {shopSettings?.brand_name || 'SNEEK'}<span>.</span>
          </a>
          <p>
            An progressive menswear concept specializing in techwear accents, oversized drapery, and minimalist color systems. Designed for utility.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon-btn" title="Website"><Globe size={18} /></a>
            <a href="#" className="social-icon-btn" title="Share"><Share2 size={18} /></a>
            <a href="#" className="social-icon-btn" title="Contact"><Mail size={18} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Collections</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>New Arrivals</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Best Sellers</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Outerwear</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }}>Utility Pants</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Service</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => e.preventDefault()}>Shipping & Returns</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Sizing Care Guide</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('contact'); }}>Contact Support</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('locations'); }}>Store Locations</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }}>Our Philosophy</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Eco-Conscious Fabrics</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Careers</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Press & Media</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {shopSettings?.brand_name || 'SNEEK'} Co. All rights reserved.</p>
        <p>Crafted for modern streetwear aesthetics.</p>
      </div>
    </footer>
  );
}
