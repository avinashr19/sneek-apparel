import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Navbar({ currentView, setCurrentView }) {
    const { cartCount, setIsCartOpen } = useCart();
    const { isAdmin, logout } = useAuth();
    const { shopSettings } = useSettings();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavClick = (view, e) => {
        e.preventDefault();
        setCurrentView(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="site-header">
            <div className="header-container">
                {/* LOGO AREA */}
                <div className="nav-logo">
                    <a href="#" onClick={(e) => handleNavClick('home', e)} style={{ 
                        color: 'var(--brand-name-color)', 
                        textDecoration: 'none',
                        fontSize: 'var(--brand-font-size)',
                        fontWeight: 'var(--brand-font-weight)',
                        fontFamily: 'var(--brand-font-family)'
                    }}>
                        {shopSettings?.brand_name?.toUpperCase() || 'SNEEK'}
                    </a>
                </div>

                {/* DESKTOP NAVIGATION LINKS */}
                <nav className="desktop-nav">
                    <ul className="navbar-links">
                        <li>
                            <a href="#" className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => handleNavClick('home', e)}>Home</a>
                        </li>
                        <li>
                            <a href="#" className={`nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={(e) => handleNavClick('shop', e)}>Shop</a>
                        </li>
                        <li>
                            <a href="#" className={`nav-link ${currentView === 'about' ? 'active' : ''}`} onClick={(e) => handleNavClick('about', e)}>About</a>
                        </li>
                        <li>
                            <a href="#" className={`nav-link ${currentView === 'locations' ? 'active' : ''}`} onClick={(e) => handleNavClick('locations', e)}>Showrooms</a>
                        </li>
                        <li>
                            <a href="#" className={`nav-link ${currentView === 'contact' ? 'active' : ''}`} onClick={(e) => handleNavClick('contact', e)}>Contact</a>
                        </li>
                        {isAdmin && (
                            <li>
                                <a href="#" className={`nav-link ${currentView === 'admin' ? 'active' : ''}`} onClick={(e) => handleNavClick('admin', e)}>Admin</a>
                            </li>
                        )}
                    </ul>
                </nav>

                {/* UTILITY ACTIONS */}
                <div className="header-actions">
                    {isAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="admin-badge">Admin ON</span>
                            <button
                                onClick={logout}
                                className="header-btn"
                                title="Admin Logout"
                                id="admin-logout-btn"
                                style={{ display: 'inline-flex' }}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}

                    <button
                        className="header-btn cart-badge-container"
                        onClick={() => setIsCartOpen(true)}
                        id="cart-trigger-btn"
                        title="Open Bag"
                    >
                        <ShoppingBag size={22} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    {/* MOBILE MENU TOGGLE */}
                    <button 
                        className="header-btn mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-dropdown">
                    {/* MOBILE LOGO AREA */}
                    <div className="nav-logo" style={{ margin: '0 auto', transform: 'translateX(-20px)' }}>
                        <a href="#" onClick={(e) => handleNavClick('home', e)} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {shopSettings?.brand_name || 'SNEEK'}<span>.</span>
                        </a>
                    </div>
                    <nav>
                        <ul className="mobile-navbar-links">
                            <li><a href="#" className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={(e) => handleNavClick('home', e)}>Home</a></li>
                            <li><a href="#" className={`nav-link ${currentView === 'shop' ? 'active' : ''}`} onClick={(e) => handleNavClick('shop', e)}>Shop</a></li>
                            <li><a href="#" className={`nav-link ${currentView === 'about' ? 'active' : ''}`} onClick={(e) => handleNavClick('about', e)}>About</a></li>
                            <li><a href="#" className={`nav-link ${currentView === 'locations' ? 'active' : ''}`} onClick={(e) => handleNavClick('locations', e)}>Showrooms</a></li>
                            <li><a href="#" className={`nav-link ${currentView === 'contact' ? 'active' : ''}`} onClick={(e) => handleNavClick('contact', e)}>Contact</a></li>
                            {isAdmin && (
                                <li><a href="#" className={`nav-link ${currentView === 'admin' ? 'active' : ''}`} onClick={(e) => handleNavClick('admin', e)}>Admin</a></li>
                            )}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}
