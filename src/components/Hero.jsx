import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Hero({ setCurrentView }) {
  const { bannerSlides } = useSettings();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!bannerSlides || bannerSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % bannerSlides.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(timer);
  }, [bannerSlides]);

  const handlePrev = () => {
    if (!bannerSlides || bannerSlides.length === 0) return;
    setActiveSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleNext = () => {
    if (!bannerSlides || bannerSlides.length === 0) return;
    setActiveSlide(prev => (prev + 1) % bannerSlides.length);
  };

  if (!bannerSlides || bannerSlides.length === 0) {
    return (
      <section className="hero-section" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading collection drafts...</p>
      </section>
    );
  }

  const currentSlide = bannerSlides[activeSlide] || bannerSlides[0];

  return (
    <section 
      className="hero-section" 
      style={{ 
        position: 'relative',
        minHeight: '75vh',
        padding: '0',
        display: 'flex',
        alignItems: currentSlide.text_y_pos || 'center',
        justifyContent: currentSlide.text_x_pos || 'center',
        background: 'var(--bg-darker)'
      }}
    >
      {/* Background Slides */}
      {bannerSlides.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 14, 0.45) 0%, rgba(12, 12, 14, 0.9) 100%), url(${s.img_url || s.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeSlide === idx ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 1
          }}
        />
      ))}

      {/* Decorative Glow */}
      <div className="hero-glow" style={{ zIndex: 2 }}></div>

      {/* Hero Content Box */}
      <div className="hero-content" style={{ 
        zIndex: 10, 
        padding: '80px 40px', 
        maxWidth: '900px',
        transform: `scale(${currentSlide.text_scale || 1})`,
        transformOrigin: `${currentSlide.text_x_pos === 'flex-start' ? 'left' : currentSlide.text_x_pos === 'flex-end' ? 'right' : 'center'} ${currentSlide.text_y_pos === 'flex-start' ? 'top' : currentSlide.text_y_pos === 'flex-end' ? 'bottom' : 'center'}`,
        textAlign: currentSlide.text_x_pos === 'flex-start' ? 'left' : currentSlide.text_x_pos === 'flex-end' ? 'right' : 'center',
        color: currentSlide.text_color || '#ffffff'
      }}>
        <span 
          className="hero-tag" 
          style={{ 
            color: 'var(--accent)', 
            letterSpacing: '0.25em',
            background: 'rgba(0,0,0,0.5)',
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '4px',
            marginBottom: '24px'
          }}
        >
          {currentSlide.tag}
        </span>

        <h1 
          className="hero-title" 
          style={{ 
            fontSize: '56px', 
            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
            color: 'inherit',
            marginBottom: '16px' 
          }}
        >
          {currentSlide.title}
        </h1>

        <p 
          className="hero-desc" 
          style={{ 
            fontSize: '18px', 
            textShadow: '0 2px 6px rgba(0,0,0,0.8)',
            color: currentSlide.text_color || '#e5e7eb',
            maxWidth: '700px',
            margin: '0 auto 24px'
          }}
        >
          {currentSlide.desc}
        </p>

        {/* Offer Ribbon */}
        <div 
          style={{
            display: 'inline-block',
            border: '1px solid var(--accent)',
            background: 'var(--accent-soft)',
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '32px',
            animation: (!currentSlide.offer_effect || currentSlide.offer_effect === 'none') ? 'none' : currentSlide.offer_effect === 'bounce' ? 'bounce 2s infinite' : currentSlide.offer_effect === 'slide-in' ? 'slideInRight 1s ease-out' : 'pulseGlow 2s ease-in-out infinite'
          }}
        >
          {currentSlide.offer}
        </div>

        <div className="hero-actions" style={{ justifyContent: currentSlide.text_x_pos === 'flex-start' ? 'flex-start' : currentSlide.text_x_pos === 'flex-end' ? 'flex-end' : 'center' }}>
          <button 
            className="btn-accent" 
            onClick={() => setCurrentView('shop')}
            id="hero-shop-btn"
          >
            Shop The Drop
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentView('shop')}
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            Explore Catalog
          </button>
        </div>
      </div>

      {/* Chevron Left / Right controls */}
      <button 
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 15,
          background: 'rgba(12, 12, 14, 0.6)',
          border: '1px solid var(--border-luxe)',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'var(--transition-smooth)'
        }}
        className="carousel-arrow"
        title="Previous Offer"
      >
        <ChevronLeft size={22} />
      </button>

      <button 
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 15,
          background: 'rgba(12, 12, 14, 0.6)',
          border: '1px solid var(--border-luxe)',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'var(--transition-smooth)'
        }}
        className="carousel-arrow"
        title="Next Offer"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots Index indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 15
        }}
      >
        {bannerSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            style={{
              width: activeSlide === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeSlide === idx ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              padding: '0'
            }}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
