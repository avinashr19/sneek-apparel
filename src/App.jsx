import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopPage from './components/ShopPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import LocationsPage from './components/LocationsPage';
import ReviewsSection from './components/ReviewsSection';
import { SettingsProvider, useSettings } from './context/SettingsContext';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shopSettings } = useSettings();

  useEffect(() => {
    if (shopSettings?.brand_name) {
      document.title = `${shopSettings.brand_name} // Premium Menswear`;
    }
  }, [shopSettings?.brand_name]);

  // Map pathnames to views
  let currentView = 'home';
  if (location.pathname === '/shop') currentView = 'shop';
  if (location.pathname === '/admin') currentView = 'admin';
  if (location.pathname === '/contact') currentView = 'contact';
  if (location.pathname === '/about') currentView = 'about';
  if (location.pathname === '/locations') currentView = 'locations';

  const setCurrentView = (view) => {
    if (view === 'home') navigate('/');
    else if (view === 'shop') navigate('/shop');
    else if (view === 'admin') navigate('/admin');
    else if (view === 'contact') navigate('/contact');
    else if (view === 'about') navigate('/about');
    else if (view === 'locations') navigate('/locations');
  };
  const [toasts, setToasts] = useState([]);
  const { products } = useProducts();
  const { isAdmin } = useAuth();

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Extract featured models for homepage
  const featured = products.filter(p => p.featured);

  return (
    <div className="app-container">
      {/* ANNOUNCEMENT BAR */}
      {shopSettings.announcementBar && (
        <div 
          style={{ 
            background: 'var(--accent)', 
            color: 'var(--bg-darker)', 
            fontSize: '11px', 
            fontWeight: '700', 
            textAlign: 'center', 
            padding: '6px 10px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            whiteSpace: 'pre-line'
          }}
          id="announcement-bar"
        >
          {shopSettings.announcementBar}
        </div>
      )}

      {/* GLOBAL NAVBAR */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* VIEW ROUTER */}
      <main className="main-wrapper">
        <Routes>
          <Route path="/" element={
            <div>
              <Hero setCurrentView={setCurrentView} />

              {/* FEATURED SECTIONS */}
              <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '8px 40px 80px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '40px',
                    borderBottom: '1px solid var(--border-luxe)',
                    paddingBottom: '20px'
                  }}
                >
                  <h2 style={{ fontSize: '28px', textTransform: 'uppercase' }}>Featured Garments</h2>
                  <button
                    onClick={() => setCurrentView('shop')}
                    style={{
                      color: 'var(--accent)',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    id="view-all-featured-btn"
                  >
                    View All Shop →
                  </button>
                </div>

                {featured.length === 0 ? (
                  <div className="no-products" style={{ padding: '60px' }}>
                    <h3>No featured products</h3>
                  </div>
                ) : (
                  <div className="products-grid">
                    {featured.slice(0, 3).map((prod) => (
                      <ProductCard key={prod.id} product={prod} addToast={addToast} />
                    ))}
                  </div>
                )}
              </section>
              <ReviewsSection />
            </div>
          } />
          <Route path="/shop" element={<ShopPage addToast={addToast} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/contact" element={<ContactPage addToast={addToast} />} />
          <Route path="/admin" element={
            isAdmin ? (
              <AdminDashboard addToast={addToast} />
            ) : (
              <AdminLogin addToast={addToast} />
            )
          } />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer setCurrentView={setCurrentView} />

      {/* SLIDE OUT CART DRAWER */}
      <CartDrawer addToast={addToast} />

      {/* TOAST SYSTEM POPUPS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''}`}>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <SettingsProvider>
            <HashRouter>
              <AppContent />
            </HashRouter>
          </SettingsProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
