import React from 'react';
import { Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function ReviewsSection() {
    const { storeReviews } = useSettings();

    if (!storeReviews || storeReviews.length === 0) return null;

    return (
        <section className="reviews-section" style={{ padding: '80px 40px', background: 'var(--bg-main)' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '32px', textTransform: 'uppercase', marginBottom: '16px' }}>What Our Customers Say</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>5.0</span>
                        <div style={{ display: 'flex', color: '#fbbc05' }}>
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>Based on {storeReviews.length} reviews</span>
                    </div>
                </div>

                <div className="reviews-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {storeReviews.map(review => (
                        <div key={review.id} style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-luxe)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <img 
                                    src={review.profile_photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.author_name}`} 
                                    alt={review.author_name} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{review.author_name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{review.time_text}</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', color: '#fbbc05', marginBottom: '12px' }}>
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            
                            <div className="review-text" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', flexGrow: 1 }} dangerouslySetInnerHTML={{ __html: review.text }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
