import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function LocationsPage() {
  const { locations } = useSettings();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px' }}>
      <div className="admin-title-area" style={{ marginBottom: '40px', borderBottom: '1px solid var(--border-luxe)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px' }}>STORE SHOWROOMS</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore our flagship spaces and retail showrooms globally</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', alignItems: 'start' }}>
        {locations.length === 0 ? (
          <div className="no-products" style={{ gridColumn: '1/-1', padding: '60px' }}>
            <h3>No physical stores listed</h3>
            <p style={{ marginTop: '10px' }}>Check back later or contact customer support.</p>
          </div>
        ) : (
          locations.map((s, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-luxe)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  fontSize: '10px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  fontWeight: '700'
                }}
              >
                FLAGSHIP
              </div>

              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '12px' }}>{s.city}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                {s.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={14} style={{ color: 'var(--accent)' }} />
                  <span>{s.address}</span>
                </div>
                {s.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={14} style={{ color: 'var(--accent)' }} />
                    <span>{s.phone}</span>
                  </div>
                )}
                {s.hours && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={14} style={{ color: 'var(--accent)' }} />
                    <span>{s.hours}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
