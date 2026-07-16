import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from './ProductCard';

export default function ShopPage({ addToast }) {
    const { products } = useProducts();
    const { shopCategories } = useSettings();
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSize, setActiveSize] = useState('All');
    const [activeColor, setActiveColor] = useState('All');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('default'); // default, price-asc, price-desc
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory, activeSize, activeColor, minPrice, maxPrice, sortBy]);

    // Extract categories dynamically
    const categories = useMemo(() => {
        return ['All', ...shopCategories];
    }, [shopCategories]);

    // Available sizes
    const sizes = ['All', 'S', 'M', 'L', 'XL', 'ONESIZE'];

    // Extract colors dynamically (case-insensitive and trimmed)
    const colors = useMemo(() => {
        const set = new Set();
        products.forEach(p => {
            if (p.colors && Array.isArray(p.colors)) {
                p.colors.forEach(c => {
                    if (c && c.trim()) {
                        // Capitalize each word for display
                        const formatted = c.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                        set.add(formatted);
                    }
                });
            }
        });
        return ['All', ...Array.from(set)];
    }, [products]);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query filter
        if (search.trim() !== '') {
            const q = search.toLowerCase();
            result = result.filter(
                p =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (activeCategory !== 'All') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Size filter
        if (activeSize !== 'All') {
            result = result.filter(p => p.sizes && p.sizes.includes(activeSize));
        }

        // Color filter (case-insensitive)
        if (activeColor !== 'All') {
            const activeLower = activeColor.toLowerCase();
            result = result.filter(p => 
                Array.isArray(p.colors) && p.colors.some(c => typeof c === 'string' && c.trim().toLowerCase() === activeLower)
            );
        }

        // Min price
        if (minPrice !== '') {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) {
                result = result.filter(p => p.price >= min);
            }
        }

        // Max price
        if (maxPrice !== '') {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) {
                result = result.filter(p => p.price <= max);
            }
        }

        // Sort
        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, search, activeCategory, activeSize, minPrice, maxPrice, sortBy]);

    const itemsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    return (
        <div className="shop-layout">
            <div className="shop-title-wrapper">
                <div>
                    <h1>PRODUCT WORKBENCH</h1>
                    <p className="shop-count">Showing {filteredProducts.length} of {products.length} products</p>
                </div>

                <div className="sort-container" style={{ margin: 0 }}>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                        id="sort-select"
                    >
                        <option value="default">Default Sorting</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* MOBILE FILTERS TOGGLE */}
            <button 
                className="mobile-filter-toggle btn-secondary" 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{ marginBottom: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
                {showMobileFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="filters-wrapper">
                {/* SIDEBAR FILTER PANEL */}
                <aside className={`sidebar-filters ${showMobileFilters ? 'open' : ''}`}>
                    {/* SEARCH */}
                    <div className="filter-section">
                        <h4 className="filter-title">Search</h4>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Find garment..."
                                className="search-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                id="search-input"
                            />
                            <Search className="search-icon-inside" size={16} />
                        </div>
                    </div>

                    {/* CATEGORIES */}
                    <div className="filter-section">
                        <h4 className="filter-title">Category</h4>
                        <div className="filter-pills">
                            {categories.map(c => {
                                const count = c === 'All'
                                    ? products.length
                                    : products.filter(p => p.category === c).length;

                                return (
                                    <button
                                        key={c}
                                        className={`filter-pill ${activeCategory === c ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(c)}
                                        id={`cat-filter-${c.toLowerCase()}`}
                                    >
                                        <span>{c}</span>
                                        <span className="pill-count">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SIZES */}
                    <div className="filter-section">
                        <h4 className="filter-title">Size</h4>
                        <div className="sizes-grid">
                            {sizes.map(s => (
                                <button
                                    key={s}
                                    className={`size-btn ${activeSize === s ? 'active' : ''}`}
                                    onClick={() => setActiveSize(s)}
                                    id={`size-filter-${s.toLowerCase()}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* COLOURS */}
                    <div className="filter-section">
                        <h4 className="filter-title">Colour</h4>
                        <div className="filter-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {colors.map(c => {
                                const count = c === 'All'
                                    ? products.length
                                    : products.filter(p => Array.isArray(p.colors) && p.colors.some(pc => typeof pc === 'string' && pc.trim().toLowerCase() === c.toLowerCase())).length;

                                return (
                                    <button
                                        key={c}
                                        className={`filter-pill ${activeColor === c ? 'active' : ''}`}
                                        onClick={() => setActiveColor(c)}
                                        id={`color-filter-${c.toLowerCase().replace(/\s+/g, '-')}`}
                                        style={{ fontSize: '11px', textTransform: 'uppercase' }}
                                    >
                                        <span>{c}</span>
                                        <span className="pill-count">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRICE RANGE */}
                    <div className="filter-section">
                        <h4 className="filter-title">Price Range</h4>
                        <div className="price-range-inputs">
                            <input
                                type="number"
                                placeholder="Min ₹"
                                className="price-field"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                id="price-min"
                            />
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                            <input
                                type="number"
                                placeholder="Max ₹"
                                className="price-field"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                id="price-max"
                            />
                        </div>
                        {(minPrice !== '' || maxPrice !== '') && (
                            <button
                                onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                                style={{
                                    fontSize: '11px',
                                    color: 'var(--accent)',
                                    marginTop: '10px',
                                    textDecoration: 'underline'
                                }}
                            >
                                Clear Price
                            </button>
                        )}
                    </div>
                </aside>

                {/* PRODUCTS GRID */}
                <main style={{ flexGrow: 1 }}>
                    {filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <h3>No garments found</h3>
                            <p style={{ marginTop: '10px', fontSize: '14px' }}>
                                Try relaxing your search terms or clearing active filters.
                            </p>
                             <button
                                 className="btn-secondary"
                                 style={{ marginTop: '20px' }}
                                 onClick={() => {
                                     setSearch('');
                                     setActiveCategory('All');
                                     setActiveSize('All');
                                     setActiveColor('All');
                                     setMinPrice('');
                                     setMaxPrice('');
                                 }}
                             >
                                 Reset Filters
                             </button>
                        </div>
                    ) : (
                        <div>
                            <div className="products-grid">
                                {paginatedProducts.map(p => (
                                    <ProductCard key={p.id} product={p} addToast={addToast} />
                                ))}
                            </div>

                            {/* PAGINATION CONTROLS */}
                            {totalPages > 1 && (
                                <div 
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        marginTop: '40px',
                                        borderTop: '1px solid var(--border-luxe)',
                                        paddingTop: '30px'
                                    }}
                                >
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '8px 16px', minWidth: 'auto', display: 'flex', alignItems: 'center' }}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        ← Prev
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, idx) => {
                                        const pageNum = idx + 1;
                                        // Show pages near current page, or first/last
                                        if (totalPages > 6 && pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                                            if (pageNum === 2 && currentPage > 3) {
                                                return <span key={pageNum} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>...</span>;
                                            }
                                            if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                                                return <span key={pageNum} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>...</span>;
                                            }
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: 'var(--radius)',
                                                    background: currentPage === pageNum ? 'var(--accent)' : 'var(--bg-card)',
                                                    border: '1px solid var(--border-luxe)',
                                                    color: currentPage === pageNum ? 'var(--bg-darker)' : 'var(--text-primary)',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'var(--transition-smooth)'
                                                }}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '8px 16px', minWidth: 'auto', display: 'flex', alignItems: 'center' }}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
