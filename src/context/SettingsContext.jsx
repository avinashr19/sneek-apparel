import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLIENT_THEME } from '../themeConfig';

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SLIDES = [
  {
    tag: 'NEW RELEASES',
    title: 'SLOUCH STRUCTURES',
    desc: 'LIMITED EXTRA HEAVYWEIGHT UTILITY PIECES INSPIRED BY MOTORSPORT COLLINS.',
    offer: 'INTRODUCTORY PRICE // 15% AUTOMATIC REBATE AT CHECKOUT',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1600'
  },
  {
    tag: 'FASHION TECH',
    title: 'UTILITY OVERVESTS',
    desc: 'WATER REPELLENT DUPONT STRUCTURAL SHELLS BUILT FOR CLIMATE FLEXIBILITY.',
    offer: 'EXCLUSIVE INDIA RELEASE // FREE DELIVERY IN ALL flagship METROS',
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1600'
  },
  {
    tag: 'SEASONAL PIECES',
    title: 'TECHNICAL SWEATERS',
    desc: 'DRAWER STRUCTURE RIBBING ENGINEERED IN MATTE BLACK COBALT & SAGE STRUCT.',
    offer: 'SHIPPING IMMEDIATELY FROM MUMBAI & BANGALORE SHOWROOMS',
    img: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1600'
  }
];

const DEFAULT_LOCATIONS = [
  {
    city: 'Mumbai // Colaba Flagship',
    address: 'Gateway Chambers, Shivaji Marg, Colaba, Mumbai, MH 400001',
    phone: '+91 22 6634 9821',
    hours: '11:00 AM - 9:00 PM Daily',
    description: 'Our primary technical hub located in the historic Gateway precinct, showcasing limited-run outer garments.'
  },
  {
    city: 'Bengaluru // Indiranagar Concept',
    address: '100 Feet Rd, Hal 2nd Stage, Indiranagar, Bengaluru, KA 560038',
    phone: '+91 80 4125 7800',
    hours: '11:00 AM - 9:30 PM Daily',
    description: 'A multi-level modular pavilion with full size customizations and an integrated community espresso deck.'
  },
  {
    city: 'New Delhi // Hauz Khas Gallery',
    address: 'A-18, Hauz Khas Village, New Delhi, DL 110016',
    phone: '+91 11 4057 1290',
    hours: '12:00 PM - 8:30 PM Daily',
    description: 'A gallery space presenting seasonal collection drops, collaborative streetwear, and graphic pieces.'
  }
];

const DEFAULT_SETTINGS = {
  freeShippingThreshold: 9999,
  announcementBar: 'NEW COLLECTION DROP // DISPATCHING DAILY ACROSS INDIA',
  contactEmail: 'concierge@sneek.in',
  whatsapp: '+91 9876543210',
  instagram: '@sneek.india',
  facebook: 'facebook.com/sneek.india',
  aboutMission: 'DESIGNING HIGH-PERFORMANCE UTILITY BASES AND OVERSIZED TEXTURES FOR COMFORT AND STREET SILHOUETTES.',
  aboutStory: 'Established in 2026, sneek is a progressive concept focused on merging technical techwear details with draped streetwear silhouettes. Every drop is crafted in limited batches from heavyweight organic cotton fleece, ripstop structures, and carbon pigments. Engineered for presence in India.'
};

export const SettingsProvider = ({ children }) => {
  const [bannerSlides, setBannerSlides] = useState([]);
  const [locations, setLocations] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);
  const [shopSettings, setShopSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-darker', CLIENT_THEME.themeBg || '#0c0c0e');
    root.style.setProperty('--accent', CLIENT_THEME.themeAccent || '#d2ff00');
    root.style.setProperty('--text-primary', CLIENT_THEME.themeText || '#ffffff');
    root.style.setProperty('--bg-card', CLIENT_THEME.themeCard || '#141418');
    root.style.setProperty('--border-luxe', CLIENT_THEME.themeBorder || '#24242c');
    
    // Auto-calculate translucent states
    const accent = CLIENT_THEME.themeAccent || '#d2ff00';
    root.style.setProperty('--accent-soft', accent + '1a'); // 10% opacity
    root.style.setProperty('--border-hover', accent + '33'); // 20% opacity
  }, []);

  useEffect(() => {
    // Load slides
    const cachedSlides = localStorage.getItem('sneek_banner_slides');
    if (cachedSlides) {
      setBannerSlides(JSON.parse(cachedSlides));
    } else {
      setBannerSlides(DEFAULT_SLIDES);
      localStorage.setItem('sneek_banner_slides', JSON.stringify(DEFAULT_SLIDES));
    }

    // Load locations
    const cachedLocations = localStorage.getItem('sneek_locations');
    if (cachedLocations) {
      setLocations(JSON.parse(cachedLocations));
    } else {
      setLocations(DEFAULT_LOCATIONS);
      localStorage.setItem('sneek_locations', JSON.stringify(DEFAULT_LOCATIONS));
    }

    // Load settings
    const cachedSettings = localStorage.getItem('sneek_shop_settings');
    if (cachedSettings) {
      const parsed = JSON.parse(cachedSettings);
      const merged = { ...DEFAULT_SETTINGS, ...parsed };
      setShopSettings(merged);
      localStorage.setItem('sneek_shop_settings', JSON.stringify(merged));
    } else {
      setShopSettings(DEFAULT_SETTINGS);
      localStorage.setItem('sneek_shop_settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    // Load categories
    const cachedCategories = localStorage.getItem('sneek_categories');
    if (cachedCategories) {
      setShopCategories(JSON.parse(cachedCategories));
    } else {
      const defaultCats = ['Hoodies', 'Pants', 'T-Shirts', 'Outerwear', 'Sweaters', 'Accessories'];
      setShopCategories(defaultCats);
      localStorage.setItem('sneek_categories', JSON.stringify(defaultCats));
    }
  }, []);

  const saveSlides = (updated) => {
    setBannerSlides(updated);
    localStorage.setItem('sneek_banner_slides', JSON.stringify(updated));
  };

  const addSlide = (slide) => {
    const updated = [...bannerSlides, slide];
    saveSlides(updated);
  };

  const removeSlide = (index) => {
    const updated = bannerSlides.filter((_, idx) => idx !== index);
    saveSlides(updated);
  };

  const saveLocations = (updated) => {
    setLocations(updated);
    localStorage.setItem('sneek_locations', JSON.stringify(updated));
  };

  const addLocation = (loc) => {
    const updated = [...locations, loc];
    saveLocations(updated);
  };

  const removeLocation = (index) => {
    const updated = locations.filter((_, idx) => idx !== index);
    saveLocations(updated);
  };

  const saveCategories = (updated) => {
    setShopCategories(updated);
    localStorage.setItem('sneek_categories', JSON.stringify(updated));
  };

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const exists = shopCategories.some(c => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;
    
    const formattedName = trimmed
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const updated = [...shopCategories, formattedName];
    saveCategories(updated);
    return true;
  };

  const removeCategory = (name) => {
    const updated = shopCategories.filter(c => c !== name);
    saveCategories(updated);
  };

  const updateSettings = (fields) => {
    const updated = { ...shopSettings, ...fields };
    setShopSettings(updated);
    localStorage.setItem('sneek_shop_settings', JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{
      bannerSlides,
      locations,
      shopCategories,
      shopSettings,
      addSlide,
      removeSlide,
      addLocation,
      removeLocation,
      addCategory,
      removeCategory,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
