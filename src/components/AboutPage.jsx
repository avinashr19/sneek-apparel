import React from 'react';
import { Target, HardHat, Feather, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AboutPage() {
  const { shopSettings } = useSettings();

  const values = [
    {
      title: 'TECHNICAL TEXTURES',
      desc: 'We explore ripstops, water-repellent coatings, and breathable cotton mixtures for daily performance.',
      icon: <HardHat size={20} />
    },
    {
      title: 'OVERSIZED DRAPERY',
      desc: 'Our silhouettes are designed with drop-shoulders and structural room to encourage ease of movement.',
      icon: <Feather size={20} />
    },
    {
      title: 'LIMITED DRAFT RUNS',
      desc: 'To preserve styling uniqueness and maintain eco-conscious stocks, we manufacture in strictly limited batches.',
      icon: <Sparkles size={20} />
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
      <div className="admin-title-area" style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-luxe)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px' }}>OUR PHILOSOPHY</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover the progressive design philosophy behind the SNEEK brand</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center', marginBottom: '60px' }}>
        <div>
          <span className="hero-tag" style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '11px', display: 'block', marginBottom: '16px' }}>
            THE SNEEK MISSION
          </span>
          <h2 
            style={{ 
              fontSize: '28px', 
              lineHeight: '1.4', 
              color: 'var(--text-primary)', 
              textTransform: 'uppercase', 
              marginBottom: '24px',
              fontFamily: 'var(--font-serif)'
            }}
          >
            "{shopSettings.aboutMission}"
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
            {shopSettings.aboutStory}
          </p>
        </div>

        {/* Dynamic fashion background card placeholder */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(210,255,0,0.1) 0%, rgba(20,20,24,0.8) 100%)',
            border: '1px solid var(--border-luxe)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-luxe)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <Target size={48} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 style={{ fontSize: '20px', textTransform: 'uppercase', textAlign: 'center' }}>ENGINEERED APPAREL</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.6' }}>
            Every pattern draft is tested in real-world street settings. We optimize pocket access angles, neck rib ribbing tensions, and drop-shoulder dimensions for maximum comfort.
          </p>
        </div>
      </div>

      {/* Brand Values Section */}
      <div style={{ borderTop: '1px solid var(--border-luxe)', paddingTop: '60px' }}>
        <h2 style={{ fontSize: '22px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '40px' }}>DESIGN CHARACTERISTICS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {values.map((v, i) => (
            <div 
              key={i} 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-luxe)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                textAlign: 'center',
                transition: 'var(--transition-smooth)'
              }}
              className="feature-box"
            >
              <div 
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--accent)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '1px solid var(--border-luxe)'
                }}
              >
                {v.icon}
              </div>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '12px' }}>{v.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
