import React from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView }) {
    const { cartCount, setIsCartOpen } = useCart();
    const { isAdmin, logout } = useAuth();

    return (
        <header className="site-header">
            <div className="header-container">
                {/* LOGO */}
                <a
                    href="#"
                    className="logo-link"
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentView('home');
                    }}
                >
                    SNEEK<span>.</span>
                </a>

                {/* NAVIGATION LINKS */}
                <nav>
                    <ul className="navbar-links">
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentView('home');
                                }}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentView === 'shop' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentView('shop');
                                }}
                            >
                                Shop
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentView === 'about' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentView('about');
                                }}
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentView === 'locations' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentView('locations');
                                }}
                            >
                                Showrooms
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentView('contact');
                                }}
                            >
                                Contact
                            </a>
                        </li>
                        {isAdmin && (
                            <li>
                                <a
                                    href="#"
                                    className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentView('admin');
                                    }}
                                >
                                    Admin
                                </a>
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
                </div>
            </div>
        </header>
    );
}
