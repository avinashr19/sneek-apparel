import React from 'react';
import { Globe, Share2, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer({ setCurrentView }) {
  const { shopSettings } = useSettings();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="site-footer" style={{ background: 'var(--footer-bg-color)', color: 'var(--footer-text-color)' }}>
        <div className="footer-grid-simple">
          
          {/* Column 1: Brand & Bio */}
          <div className="footer-col-simple">
            <h2 className="footer-logo">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentView('home'); scrollToTop(); }} 
                style={{ 
                  color: 'var(--brand-name-color)',
                  fontSize: 'var(--brand-font-size)',
                  fontWeight: 'var(--brand-font-weight)',
                  fontFamily: 'var(--brand-font-family)'
                }}
              >
                {shopSettings?.brand_logo_url ? (
                    <img src={shopSettings.brand_logo_url} alt={shopSettings?.brand_name || 'Brand Logo'} style={{ width: 'var(--brand-logo-width)', height: 'var(--brand-logo-height)', objectFit: 'contain', display: 'block', marginBottom: '16px' }} />
                ) : (
                    shopSettings?.brand_name?.toUpperCase() || 'SNEEK'
                )}
              </a>
            </h2>
            <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: '1.5' }}>
              {shopSettings?.footer_bio || 'Weft Denim crafts sustainable, comfortable and stylish denim & footwear for modern living. Visit our store or order via WhatsApp.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col-simple">
            <h4 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Quick Links</h4>
            <div style={{ display: 'flex', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('shop'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Shop</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('about'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Lookbook</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('locations'); }} style={{ color: 'inherit', textDecoration: 'underline' }}>Visit</a>
            </div>
            {shopSettings?.whatsapp && (
              <p style={{ fontSize: '14px' }}>Phone: <a href={`https://wa.me/91${shopSettings.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>+91 {shopSettings.whatsapp}</a></p>
            )}
          </div>

          {/* Column 3: Newsletter */}
          <div className="footer-col-simple">
            <h4 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Newsletter</h4>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Subscribe for new drops & offers.</p>
            <form style={{ display: 'flex', gap: '8px' }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" required style={{ padding: '10px 14px', borderRadius: '4px', border: 'none', flex: 1, fontSize: '14px', color: '#000' }} />
              <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', background: '#d30000', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-simple" style={{ marginTop: '40px', textAlign: 'center', fontSize: '13px', borderTop: 'none' }}>
          <p>{shopSettings?.footer_copyright_text || `© ${new Date().getFullYear()} Weft Denim · Crafted in Hyderabad · Developed by Webtechie`}</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="floating-buttons" style={{ position: 'fixed', bottom: '30px', right: '30px', display: 'flex', gap: '12px', zIndex: 1000, alignItems: 'center' }}>
        {shopSettings?.whatsapp && (
          <a 
            href={`https://wa.me/91${shopSettings.whatsapp}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ 
              background: '#25D366', 
              color: '#fff', 
              padding: '12px 20px', 
              borderRadius: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ fontSize: '18px' }}>📞</span> WhatsApp
          </a>
        )}
        <button 
          onClick={scrollToTop} 
          style={{ 
            background: '#000', 
            color: '#fff', 
            width: '45px', 
            height: '45px', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          ↑
        </button>
      </div>
    </>
  );
}
