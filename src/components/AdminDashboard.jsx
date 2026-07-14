import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, IndianRupee, Layers, PlusCircle, X, Shield, Settings, Sliders, MapPin, Edit3, Download } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useSettings } from '../context/SettingsContext';
import BulkUpload from './BulkUpload';

export default function AdminDashboard({ addToast }) {
  const { products, addNewProduct, deleteProduct } = useProducts();
  const { 
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
  } = useSettings();

  const [activeTab, setActiveTab] = useState('garments'); // garments, carousel, locations, settings
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    img: '',
    sizes: 'S, M, L, XL',
    colors: 'Matte Black',
    tags: 'NEW'
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);

  // Set default category when modal opens
  useEffect(() => {
    if (showAddModal && shopCategories.length > 0 && !newProduct.category) {
      setNewProduct(prev => ({ ...prev, category: shopCategories[0] }));
    }
  }, [showAddModal, shopCategories]);

  // Slide Form state
  const [newSlide, setNewSlide] = useState({
    tag: '',
    title: '',
    desc: '',
    offer: '',
    img: ''
  });

  // Location Form state
  const [newLoc, setNewLoc] = useState({
    city: '',
    address: '',
    phone: '',
    hours: '10:00 AM - 8:00 PM Daily',
    description: ''
  });

  // General Settings state
  const [announcementText, setAnnouncementText] = useState('');
  const [shippingThreshold, setShippingThreshold] = useState(150);
  const [emailContact, setEmailContact] = useState('');
  const [aboutMission, setAboutMission] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  useEffect(() => {
    if (shopSettings) {
      setAnnouncementText(shopSettings.announcementBar || '');
      setShippingThreshold(shopSettings.freeShippingThreshold || 150);
      setEmailContact(shopSettings.contactEmail || '');
      setAboutMission(shopSettings.aboutMission || '');
      setAboutStory(shopSettings.aboutStory || '');
      setWhatsapp(shopSettings.whatsapp || '');
      setInstagram(shopSettings.instagram || '');
      setFacebook(shopSettings.facebook || '');
    }
  }, [shopSettings]);

  useEffect(() => {
    const totalPagesLedger = Math.ceil(products.length / 10);
    if (ledgerPage > totalPagesLedger && totalPagesLedger > 0) {
      setLedgerPage(totalPagesLedger);
    }
  }, [products, ledgerPage]);

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      addToast('Please fill in required name and price fields.', 'error');
      return;
    }

    const added = addNewProduct(newProduct);
    addToast(`Manually added ${added.name} to catalog.`);
    setShowAddModal(false);
    
    // Reset form
    setNewProduct({
      name: '',
      price: '',
      category: 'Hoodies',
      description: '',
      img: '',
      sizes: 'S, M, L, XL',
      colors: 'Matte Black',
      tags: 'NEW'
    });
  };

  const handleDeleteProduct = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(id);
      addToast(`Deleted ${name} from catalog.`, 'error');
    }
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.img) {
      addToast('Slide title and image URL are required.', 'error');
      return;
    }

    addSlide(newSlide);
    addToast('New homepage banner slide added successfully.');
    
    // Reset slide form
    setNewSlide({
      tag: '',
      title: '',
      desc: '',
      offer: '',
      img: ''
    });
  };

  const handleDeleteSlide = (index) => {
    if (bannerSlides.length <= 1) {
      addToast('You must keep at least 1 homepage slide to prevent banner breakdown.', 'error');
      return;
    }

    if (confirm('Delete this homepage slide?')) {
      removeSlide(index);
      addToast('Slide removed from homepage banner.', 'error');
    }
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLoc.city || !newLoc.address) {
      addToast('City title and address are required.', 'error');
      return;
    }

    addLocation(newLoc);
    addToast('New showroom location added successfully.');
    
    // Reset location form
    setNewLoc({
      city: '',
      address: '',
      phone: '',
      hours: '10:00 AM - 8:00 PM Daily',
      description: ''
    });
  };

  const handleDeleteLocation = (index) => {
    if (confirm('Delete this showroom location?')) {
      removeLocation(index);
      addToast('Showroom location removed.', 'error');
    }
  };

  const handleManualAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const success = addCategory(newCategoryName);
    if (success) {
      addToast(`Category "${newCategoryName}" added successfully.`);
      setNewCategoryName('');
    } else {
      addToast(`Category "${newCategoryName}" already exists!`, 'error');
    }
  };

  const handleDeleteCategory = (catName) => {
    const matchCount = products.filter(p => p.category === catName).length;
    let message = `Are you sure you want to delete category "${catName}"?`;
    if (matchCount > 0) {
      message = `Warning: There are ${matchCount} garments in category "${catName}". Deleting this category will leave them without a valid category filter. Proceed?`;
    }
    if (confirm(message)) {
      removeCategory(catName);
      addToast(`Category "${catName}" removed.`, 'error');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      freeShippingThreshold: parseFloat(shippingThreshold) || 0,
      announcementBar: announcementText,
      contactEmail: emailContact,
      aboutMission,
      aboutStory,
      whatsapp,
      instagram,
      facebook
    });
    addToast('General store settings updated successfully.');
  };

  const handleExportProductsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "default_products.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
    addToast('Products database exported successfully.');
  };

  const handleExportSettingsJson = () => {
    const settingsData = {
      bannerSlides,
      locations,
      shopCategories,
      shopSettings
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "default_settings.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
    addToast('Store configurations exported successfully.');
  };

  // Compute catalog stats
  const totalValue = products.reduce((acc, p) => acc + p.price, 0);
  const distinctCategories = new Set(products.map(p => p.category)).size;

  const itemsPerPageLedger = 10;
  const totalPagesLedger = Math.ceil(products.length / itemsPerPageLedger);
  const paginatedLedgerProducts = products.slice((ledgerPage - 1) * itemsPerPageLedger, ledgerPage * itemsPerPageLedger);

  return (
    <div className="admin-layout">
      {/* HEADER SECTION */}
      <div className="admin-header-row">
        <div className="admin-title-area">
          <h1>SNEEK CONTROL BOARD</h1>
          <p>Configure garments, landing page carousel slides, showroom locations, and thresholds</p>
        </div>

        {activeTab === 'garments' && (
          <div className="admin-sub-actions">
            <button 
              className="btn-accent" 
              onClick={() => setShowAddModal(true)}
              id="add-manual-trigger"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <PlusCircle size={18} /> Add Single Garment
            </button>
          </div>
        )}
      </div>

      {/* DASHBOARD TABS ROW */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          borderBottom: '1px solid var(--border-luxe)', 
          marginBottom: '30px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        {[
          { id: 'garments', label: 'Garments Ledger', icon: <Layers size={14} /> },
          { id: 'categories', label: 'Categories', icon: <Tag size={14} /> },
          { id: 'carousel', label: 'Home Carousel', icon: <Sliders size={14} /> },
          { id: 'locations', label: 'Showrooms', icon: <MapPin size={14} /> },
          { id: 'settings', label: 'General Config', icon: <Settings size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`nav-link`}
            style={{
              padding: '12px 24px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              textTransform: 'uppercase',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setActiveTab(tab.id)}
            id={`tab-btn-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: GARMENTS */}
      {activeTab === 'garments' && (
        <div>
          {/* STATS STRIP */}
          <div className="stats-strip">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Layers size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Catalog Catalog</span>
                <div className="stat-val" id="stats-total-products">{products.length} Items</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <IndianRupee size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Stock Value</span>
                <div className="stat-val">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <Tag size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Categories</span>
                <div className="stat-val">{distinctCategories} Keys</div>
              </div>
            </div>
          </div>

          <div className="admin-grid">
            <BulkUpload addToast={addToast} />

            <div className="dashboard-card">
              <h3>Garment Ledger log</h3>
              <div className="table-wrapper">
                <table className="luxe-table">
                  <thead>
                    <tr>
                      <th>Product Details</th>
                      <th>Category</th>
                      <th>Sizes</th>
                      <th>Price</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          Catalog is empty. Add a product manually or upload a batch file.
                        </td>
                      </tr>
                    ) : (
                      paginatedLedgerProducts.map(p => (
                        <tr key={p.id} id={`ledger-row-${p.id.toLowerCase()}`}>
                          <td>
                            <div className="table-product-cell">
                              <img src={p.img} alt={p.name} className="table-product-img" />
                              <div>
                                <div className="table-product-name">{p.name}</div>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{p.category}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                              {p.sizes.join(', ')}
                            </span>
                          </td>
                          <td>
                             <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '700' }}>
                               ₹{parseFloat(p.price).toFixed(2)}
                             </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="table-actions" style={{ justifyContent: 'center' }}>
                              <button
                                className="icon-action-btn delete-btn"
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                title="Delete Product"
                                id={`trash-btn-${p.id.toLowerCase()}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPagesLedger > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <button 
                    onClick={() => setLedgerPage(p => Math.max(1, p - 1))}
                    disabled={ledgerPage === 1}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', minWidth: 'auto' }}
                  >
                    ← Prev
                  </button>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Page <strong>{ledgerPage}</strong> of {totalPagesLedger}
                  </span>
                  <button 
                    onClick={() => setLedgerPage(p => Math.min(totalPagesLedger, p + 1))}
                    disabled={ledgerPage === totalPagesLedger}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', minWidth: 'auto' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO CAROUSEL MANAGING */}
      {activeTab === 'carousel' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
          {/* Form to add a slide */}
          <div className="dashboard-card">
            <h3>Add Carousel Slide</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Create an auto-advancing slide with customized text overlay promos.
            </p>

            <form onSubmit={handleAddSlide} className="add-product-form">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-tag">Slide Subtitle / Label</label>
                <input 
                  type="text" 
                  id="slide-tag" 
                  className="form-input" 
                  placeholder="e.g. DROP 02 // OUTDOOR COLLECTION" 
                  value={newSlide.tag} 
                  onChange={(e) => setNewSlide(prev => ({ ...prev, tag: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-title">Main Header Title *</label>
                <input 
                  type="text" 
                  id="slide-title" 
                  className="form-input" 
                  placeholder="e.g. LIGHTWEIGHT WIND BREAKERS" 
                  value={newSlide.title} 
                  onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-desc">Slide Description</label>
                <input 
                  type="text" 
                  id="slide-desc" 
                  className="form-input" 
                  placeholder="e.g. Ripstop technical shells designed to withstand wind and light rain." 
                  value={newSlide.desc} 
                  onChange={(e) => setNewSlide(prev => ({ ...prev, desc: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-offer">Latest Offer / Promo Text</label>
                <input 
                  type="text" 
                  id="slide-offer" 
                  className="form-input" 
                  placeholder="e.g. BUY 1 GET 1 AT 50% OFF" 
                  value={newSlide.offer} 
                  onChange={(e) => setNewSlide(prev => ({ ...prev, offer: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="slide-img">Background Image URL *</label>
                <input 
                  type="url" 
                  id="slide-img" 
                  className="form-input" 
                  placeholder="e.g. https://images.unsplash.com/... (w=1200 recommended)" 
                  value={newSlide.img} 
                  onChange={(e) => setNewSlide(prev => ({ ...prev, img: e.target.value }))}
                  required
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Unsplash menswear tip: search for jacket or techwear, copy the photo URL.
                </span>
              </div>

              <button type="submit" className="btn-accent" style={{ marginTop: '10px' }} id="add-slide-submit">
                Add Slide
              </button>
            </form>
          </div>

          {/* List of current slides */}
          <div className="dashboard-card">
            <h3>Active Carousel Slides</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Currently rotating slides ({bannerSlides.length} total)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bannerSlides.map((slide, index) => (
                <div 
                  key={index} 
                  style={{
                    background: 'var(--bg-darker)',
                    border: '1px solid var(--border-luxe)',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    display: 'flex',
                    position: 'relative'
                  }}
                  id={`slide-row-${index}`}
                >
                  <img 
                    src={slide.img} 
                    alt={slide.title} 
                    style={{ width: '100px', height: '120px', objectFit: 'cover', background: 'var(--bg-input)' }} 
                  />
                  <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '600' }}>{slide.tag || 'NO TAG'}</span>
                    <h4 style={{ fontSize: '15px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '4px 0' }}>{slide.title}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '4px 0' }}>{slide.desc}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 'auto' }}>{slide.offer || 'No Promo Banner'}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteSlide(index)}
                    className="icon-action-btn delete-btn"
                    style={{ position: 'absolute', top: '16px', right: '16px' }}
                    title="Delete Slide"
                    id={`delete-slide-${index}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHOWROOMS MANAGING */}
      {activeTab === 'locations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
          {/* Form to add location */}
          <div className="dashboard-card">
            <h3>Add Showroom Location</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Create flagship location directories to appear on the Contact view.
            </p>

            <form onSubmit={handleAddLocation} className="add-product-form">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="loc-city">City / Store Header *</label>
                <input 
                  type="text" 
                  id="loc-city" 
                  className="form-input" 
                  placeholder="e.g. PARIS // LE MARAIS" 
                  value={newLoc.city} 
                  onChange={(e) => setNewLoc(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="loc-address">Street Address *</label>
                <input 
                  type="text" 
                  id="loc-address" 
                  className="form-input" 
                  placeholder="e.g. 18 Rue de Turenne, 75004 Paris, France" 
                  value={newLoc.address} 
                  onChange={(e) => setNewLoc(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="loc-phone">Contact Telephone</label>
                <input 
                  type="text" 
                  id="loc-phone" 
                  className="form-input" 
                  placeholder="e.g. +33 1-4272-XXXX" 
                  value={newLoc.phone} 
                  onChange={(e) => setNewLoc(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="loc-hours">Working Hours</label>
                <input 
                  type="text" 
                  id="loc-hours" 
                  className="form-input" 
                  placeholder="e.g. 10:00 AM - 8:00 PM Daily" 
                  value={newLoc.hours} 
                  onChange={(e) => setNewLoc(prev => ({ ...prev, hours: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="loc-desc">Showroom Description</label>
                <textarea 
                  id="loc-desc" 
                  className="form-input" 
                  placeholder="Brief summary of collection availability or showroom aesthetics..." 
                  value={newLoc.description} 
                  onChange={(e) => setNewLoc(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <button type="submit" className="btn-accent" style={{ marginTop: '10px' }} id="add-loc-submit">
                Add Location
              </button>
            </form>
          </div>

          {/* List of current showrooms */}
          <div className="dashboard-card">
            <h3>Configured Store Locations</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Currently active flagship stores ({locations.length} total)
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {locations.length === 0 ? (
                <div className="no-products" style={{ padding: '40px' }}>
                  <p>No locations configured.</p>
                </div>
              ) : (
                locations.map((loc, index) => (
                  <div 
                    key={index} 
                    style={{
                      background: 'var(--bg-darker)',
                      border: '1px solid var(--border-luxe)',
                      borderRadius: 'var(--radius)',
                      padding: '20px',
                      position: 'relative'
                    }}
                    id={`loc-row-${index}`}
                  >
                    <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px' }}>{loc.city}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{loc.address}</p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>Phone: {loc.phone || 'N/A'}</span>
                      <span>Hours: {loc.hours || 'N/A'}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteLocation(index)}
                      className="icon-action-btn delete-btn"
                      style={{ position: 'absolute', top: '16px', right: '16px' }}
                      title="Delete Location"
                      id={`delete-loc-${index}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* TAB 3.5: CATEGORIES CONTROL */}
      {activeTab === 'categories' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="dashboard-card">
            <h3>Manage Categories</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Add or remove garment categories to dynamically control search filters and manual uploads.
            </p>

            <form onSubmit={handleManualAddCategory} className="add-product-form" style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-luxe)', paddingBottom: '30px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="new-category-name">New Category Name</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    id="new-category-name" 
                    className="form-input" 
                    placeholder="e.g. Shirts, Jackets" 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-accent" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Add Category
                  </button>
                </div>
              </div>
            </form>

            <div className="categories-list-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-secondary)' }}>Active Categories ({shopCategories.length})</h4>
              {shopCategories.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No categories configured.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {shopCategories.map((cat) => {
                    const matchCount = products.filter(p => p.category === cat).length;
                    return (
                      <div 
                        key={cat} 
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-luxe)',
                          padding: '12px 20px',
                          borderRadius: 'var(--radius)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>{cat}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>({matchCount} items linked)</span>
                        </div>

                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="icon-action-btn delete-btn"
                          title="Delete Category"
                          id={`delete-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERAL CONFIGURATIONS */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="dashboard-card">
            <h3>General Store Config</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Control utility configurations that appear dynamically on storefront banners and calculations.
            </p>

            <form onSubmit={handleSaveSettings} className="add-product-form">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="config-announcement">Top Announcement Bar Text</label>
                <input 
                  type="text" 
                  id="config-announcement" 
                  className="form-input" 
                  placeholder="e.g. FREE WORLDWIDE DELIVERY ON ALL DROP ORDERS" 
                  value={announcementText} 
                  onChange={(e) => setAnnouncementText(e.target.value)}
                />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Leave blank to hide the announcement bar at the top of the site.
                </span>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="config-threshold">Free Shipping Threshold (USD) *</label>
                  <input 
                    type="number" 
                    id="config-threshold" 
                    className="form-input" 
                    placeholder="e.g. 150" 
                    value={shippingThreshold} 
                    onChange={(e) => setShippingThreshold(e.target.value)}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="config-email">Styling Support Email *</label>
                  <input 
                    type="email" 
                    id="config-email" 
                    className="form-input" 
                    placeholder="e.g. concierge@sneek.co" 
                    value={emailContact} 
                    onChange={(e) => setEmailContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              <h4 style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-luxe)', paddingTop: '16px', marginTop: '10px' }}>
                About Page Philosophy
              </h4>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="config-mission">Brand Mission Statement</label>
                <textarea 
                  id="config-mission" 
                  className="form-input" 
                  placeholder="Write mission quote..." 
                  value={aboutMission} 
                  onChange={(e) => setAboutMission(e.target.value)}
                  rows={2}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="config-story">Brand History Story</label>
                <textarea 
                  id="config-story" 
                  className="form-input" 
                  placeholder="Describe brand story..." 
                  value={aboutStory} 
                  onChange={(e) => setAboutStory(e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <h4 style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-luxe)', paddingTop: '16px', marginTop: '10px' }}>
                Social Handles & Coordinates
              </h4>

              <div className="form-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="config-whatsapp">WhatsApp Handle</label>
                  <input 
                    type="text" 
                    id="config-whatsapp" 
                    className="form-input" 
                    placeholder="e.g. +1 (555) 019-2831" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="config-instagram">Instagram Tag</label>
                  <input 
                    type="text" 
                    id="config-instagram" 
                    className="form-input" 
                    placeholder="e.g. @sneek.apparel" 
                    value={instagram} 
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="config-facebook">Facebook Page Coordinate</label>
                <input 
                  type="text" 
                  id="config-facebook" 
                  className="form-input" 
                  placeholder="e.g. facebook.com/sneek.apparel" 
                  value={facebook} 
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-accent" style={{ marginTop: '10px' }} id="save-settings-submit">
                Save General Settings
              </button>
            </form>
          </div>

          {/* DEVELOPER EXPORT CENTER */}
          <div className="dashboard-card" style={{ marginTop: '24px', border: '1px dashed var(--accent)' }}>
            <h3 style={{ color: 'var(--accent)' }}>Developer Export Center</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Set up the storefront visually, then export your database and configurations. Send these files back to the AI assistant to permanently set them as the default catalog for all visitors on GitHub.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleExportProductsJson}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={14} /> Export Products Database (JSON)
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleExportSettingsJson}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={14} /> Export Settings & Config (JSON)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SINGLE DIALOG MANUAL MODAL */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Manual Garment Entry</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualAdd}>
              <div className="modal-body">
                <div className="add-product-form">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="manual-name">Product Name *</label>
                    <input 
                      type="text" 
                      id="manual-name"
                      className="form-input" 
                      placeholder="e.g. CORE OVERSIZED TEE"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="manual-price">Price (INR) *</label>
                      <input 
                        type="number" 
                        id="manual-price"
                        step="0.01"
                        className="form-input" 
                        placeholder="e.g. 2499.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="manual-category">Category *</label>
                      <select 
                        id="manual-category"
                        className="form-input" 
                        value={newProduct.category || shopCategories[0] || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        style={{ cursor: 'pointer' }}
                      >
                        {shopCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="manual-desc">Description</label>
                    <textarea 
                      id="manual-desc"
                      className="form-input" 
                      placeholder="Enter detailed description of garment fabric, weight, drape..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      style={{ resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="manual-img">Image URL</label>
                    <input 
                      type="url" 
                      id="manual-img"
                      className="form-input" 
                      placeholder="e.g. https://images.unsplash.com/... (or blank for default placeholder)"
                      value={newProduct.img}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, img: e.target.value }))}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="manual-sizes">Sizes (Comma separated)</label>
                      <input 
                        type="text" 
                        id="manual-sizes"
                        className="form-input" 
                        placeholder="e.g. S, M, L, XL"
                        value={newProduct.sizes}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, sizes: e.target.value }))}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="manual-colors">Colors (Comma separated)</label>
                      <input 
                        type="text" 
                        id="manual-colors"
                        className="form-input" 
                        placeholder="e.g. Matte Black, Off-White"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, colors: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-accent" id="manual-add-submit">
                  Insert Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
