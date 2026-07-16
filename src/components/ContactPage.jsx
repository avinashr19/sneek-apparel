import React, { useState } from 'react';
import { Mail, MessageSquare, Globe, Camera, Send, Link } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';

export default function ContactPage({ addToast }) {
  const { shopSettings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      addToast('Please fill in your name and message.', 'error');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('feedback').insert([{
      name: form.name,
      email: form.email,
      message: form.message,
    }]);

    setLoading(false);
    if (error) {
      addToast('Failed to send message. Please try again.', 'error');
    } else {
      addToast(`Thank you, ${form.name}. Your message has been received!`);
      setForm({ name: '', email: '', message: '' });
    }
  };

  const socials = [
    {
      name: 'Direct Email',
      value: shopSettings.contactEmail,
      link: `mailto:${shopSettings.contactEmail}`,
      icon: <Mail size={20} />,
      desc: 'Send an inquiry directly to our concierge team.'
    },
    {
      name: 'WhatsApp Concierge',
      value: shopSettings.whatsapp,
      link: `https://wa.me/${(shopSettings.whatsapp?.replace(/[^0-9]/g, '')?.length === 10 ? '91' : '') + (shopSettings.whatsapp?.replace(/[^0-9]/g, '') || '')}`,
      icon: <MessageSquare size={20} />,
      desc: 'Instant styling guidelines and sizing support.'
    },
    {
      name: 'Instagram Profile',
      value: shopSettings.instagram,
      link: `https://instagram.com/${shopSettings.instagram?.replace('@', '')}`,
      icon: <Camera size={20} />,
      desc: 'Follow us for latest drops, releases, and updates.'
    },
    {
      name: 'Facebook Page',
      value: shopSettings.facebook,
      link: shopSettings.facebook?.startsWith('http') ? shopSettings.facebook : `https://${shopSettings.facebook}`,
      icon: <Globe size={20} />,
      desc: 'Browse our brand catalog listings and community pages.'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
      <div className="admin-title-area" style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-luxe)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px' }}>GET IN TOUCH</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Reach our global support desk or check out our digital coordinates</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* SOCIAL LINKS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', marginBottom: '10px' }}>Digital Coordinates</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {socials.map((soc, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-luxe)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div 
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {soc.icon}
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>{soc.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{soc.desc}</p>
                </div>

                <a 
                  href={soc.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: 'var(--accent)',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: 'auto',
                    textDecoration: 'underline'
                  }}
                >
                  {soc.value} <Link size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER ENQUIRY FORM */}
        <div 
          className="login-card" 
          style={{ 
            maxWidth: '100%', 
            background: 'var(--bg-card)', 
            backdropFilter: 'none', 
            padding: '30px' 
          }}
        >
          <h2 style={{ fontSize: '20px', textAlign: 'left', marginBottom: '8px' }}>Send Direct Stylist Request</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
            Have questions about custom cuts, sizing guidelines, or order status? Send us a direct inquiry.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Your Name</label>
              <input 
                type="text" 
                id="contact-name" 
                className="form-input" 
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Email Address</label>
              <input 
                type="email" 
                id="contact-email" 
                className="form-input" 
                placeholder="e.g. john@example.com"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-msg">Message details</label>
              <textarea 
                id="contact-msg" 
                className="form-input" 
                placeholder="Write your message here..."
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
                required
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-accent" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              disabled={loading}
              id="contact-submit-btn"
            >
              <Send size={16} />
              {loading ? 'Sending Request...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
