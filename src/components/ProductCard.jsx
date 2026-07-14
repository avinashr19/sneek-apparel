import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, addToast }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

    const handleAddToCart = () => {
        addToCart(product, 1, selectedSize, selectedColor);
        if (addToast) {
            addToast(`Added ${product.name} (${selectedSize} / ${selectedColor}) to your bag`);
        }
    };

    return (
        <article className="product-card" data-product-id={product.id}>
            <div className="product-carousel">
                <img
                    src={product.img}
                    alt={product.name}
                    className="product-img"
                    loading="lazy"
                />

                {product.tags && product.tags.length > 0 && (
                    <div className="card-overlay">
                        <span className="badge-tag">{product.tags[0]}</span>
                    </div>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>

                {/* Size/Color Pickers */}
                <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.sizes && product.sizes.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SIZE:</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {product.sizes.map(s => (
                                    <button
                                        key={s}
                                        className={`size-btn-mini ${selectedSize === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                        style={{
                                            border: '1px solid var(--border-luxe)',
                                            background: selectedSize === s ? 'var(--accent)' : 'transparent',
                                            color: selectedSize === s ? 'var(--bg-darker)' : 'var(--text-primary)',
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors && product.colors.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>COLOR:</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {product.colors.map(c => (
                                    <button
                                        key={c}
                                        className={`color-btn-mini ${selectedColor === c ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(c)}
                                        style={{
                                            border: '1px solid var(--border-luxe)',
                                            background: selectedColor === c ? 'var(--border-hover)' : 'transparent',
                                            color: 'var(--text-primary)',
                                            fontSize: '9px',
                                            padding: '2px 5px',
                                            borderRadius: '4px',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="product-bottom">
                    <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
                    <button
                        className="btn-card-buy add-to-cart-btn"
                        onClick={handleAddToCart}
                        title="Add to bag"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}
