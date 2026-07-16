import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CLIENT_THEME } from '../themeConfig';

const SettingsContext = createContext(null);
export const useSettings = () => useContext(SettingsContext);

const DEFAULT_SETTINGS = {
    free_shipping_threshold: 9999,
    announcement_bar: '',
    contact_email: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    about_mission: '',
    about_story: '',
};

export const SettingsProvider = ({ children }) => {
    const [bannerSlides, setBannerSlides] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shopCategories, setShopCategories] = useState([]);
    const [shopSettings, setShopSettings] = useState(DEFAULT_SETTINGS);
    const [storeReviews, setStoreReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Apply CSS theme variables from database
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--bg-darker', shopSettings?.primary_bg_color || '#0c0c0e');
        root.style.setProperty('--bg-card', '#141418'); 
        root.style.setProperty('--accent', shopSettings?.accent_color || '#d2ff00');
        root.style.setProperty('--brand-name-color', shopSettings?.brand_name_color || '#ffffff');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--border-luxe', '#24242c');
        
        const accent = shopSettings?.accent_color || '#d2ff00';
        root.style.setProperty('--accent-soft', accent + '1a');
        root.style.setProperty('--border-hover', accent + '33');

        root.style.setProperty('--brand-font-size', shopSettings?.brand_name_size || 'inherit');
        root.style.setProperty('--brand-font-weight', shopSettings?.brand_name_weight || 'bold');
        root.style.setProperty('--brand-font-family', shopSettings?.brand_name_font || 'inherit');
    }, [
        shopSettings?.primary_bg_color, 
        shopSettings?.accent_color,
        shopSettings?.brand_name_size,
        shopSettings?.brand_name_weight,
        shopSettings?.brand_name_font
    ]);

    // Fetch all settings data from Supabase
    const fetchAll = async () => {
        setLoading(true);
        const [slidesRes, locRes, catRes, settingsRes, reviewsRes] = await Promise.all([
            supabase.from('banner_slides').select('*').order('sort_order'),
            supabase.from('locations').select('*').order('created_at'),
            supabase.from('categories').select('*').order('name'),
            supabase.from('shop_settings').select('*').eq('id', 1).single(),
            supabase.from('store_reviews').select('*').order('created_at', { ascending: false }),
        ]);

        if (slidesRes.data) setBannerSlides(slidesRes.data);
        if (locRes.data) setLocations(locRes.data);
        if (catRes.data) setShopCategories(catRes.data.map(c => c.name));
        if (settingsRes.data) setShopSettings(settingsRes.data);
        if (reviewsRes.data) setStoreReviews(reviewsRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    // --- Banner Slides ---
    const addSlide = async (slide) => {
        const maxOrder = bannerSlides.reduce((m, s) => Math.max(m, s.sort_order || 0), 0);
        const { data, error } = await supabase
            .from('banner_slides')
            .insert([{ ...slide, img_url: slide.img || slide.img_url, sort_order: maxOrder + 1 }])
            .select()
            .single();
        if (!error && data) setBannerSlides(prev => [...prev, data]);
    };

    const removeSlide = async (id) => {
        await supabase.from('banner_slides').delete().eq('id', id);
        setBannerSlides(prev => prev.filter(s => s.id !== id));
    };

    // --- Locations ---
    const addLocation = async (loc) => {
        const { data, error } = await supabase
            .from('locations')
            .insert([loc])
            .select()
            .single();
        if (!error && data) setLocations(prev => [...prev, data]);
    };

    const removeLocation = async (id) => {
        await supabase.from('locations').delete().eq('id', id);
        setLocations(prev => prev.filter(l => l.id !== id));
    };

    // --- Categories ---
    const addCategory = async (name) => {
        const trimmed = name.trim();
        if (!trimmed) return false;
        const exists = shopCategories.some(c => c.toLowerCase() === trimmed.toLowerCase());
        if (exists) return false;

        const formatted = trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const { error } = await supabase.from('categories').insert([{ name: formatted }]);
        if (!error) setShopCategories(prev => [...prev, formatted]);
        return !error;
    };

    const removeCategory = async (name) => {
        await supabase.from('categories').delete().eq('name', name);
        setShopCategories(prev => prev.filter(c => c !== name));
    };

    // --- Shop Settings ---
    const updateSettings = async (fields) => {
        const updated = { ...shopSettings, ...fields, updated_at: new Date().toISOString() };
        const { error } = await supabase
            .from('shop_settings')
            .upsert({ id: 1, ...updated });
        if (!error) setShopSettings(updated);
    };

    // --- Reviews ---
    const addReview = async (review) => {
        const { data, error } = await supabase
            .from('store_reviews')
            .insert([review])
            .select()
            .single();
        if (!error && data) setStoreReviews(prev => [data, ...prev]);
    };

    const removeReview = async (id) => {
        await supabase.from('store_reviews').delete().eq('id', id);
        setStoreReviews(prev => prev.filter(r => r.id !== id));
    };

    // Convenience: map DB field names to old shape for backward compat
    const mappedSettings = {
        ...shopSettings,
        freeShippingThreshold: shopSettings.free_shipping_threshold,
        announcementBar: shopSettings.announcement_bar,
        contactEmail: shopSettings.contact_email,
        aboutMission: shopSettings.about_mission,
        aboutStory: shopSettings.about_story,
    };

    return (
        <SettingsContext.Provider value={{
            bannerSlides,
            locations,
            shopCategories,
            shopSettings: mappedSettings,
            storeReviews,
            loading,
            addSlide,
            removeSlide,
            addLocation,
            removeLocation,
            addCategory,
            removeCategory,
            updateSettings,
            addReview,
            removeReview,
            refetch: fetchAll,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
