import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, addToast }) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
    const [hoverIndex, setHoverIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const images = product.images && product.images.length > 0 
        ? product.images 
        : [product.img_url || product.img].filter(Boolean);

    const handleNext = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length <= 1) return;
        setHoverIndex(prev => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length <= 1) return;
        setHoverIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleMouseEnter = () => setIsHovering(true);

    const handleMouseLeave = () => {
        setIsHovering(false);
        setHoverIndex(0);
    };

    const handleAddToCart = () => {
        addToCart(product, 1, selectedSize, selectedColor);
        if (addToast) {
            addToast(`Added ${product.name} (${selectedSize} / ${selectedColor}) to your bag`);
        }
    };

    return (
        <article className="product-card" data-product-id={product.id}>
            <div 
                className="product-carousel"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative', overflow: 'hidden' }}
            >
                {images.map((imgUrl, idx) => (
                    <img
                        key={idx}
                        src={imgUrl}
                        alt={`${product.name} ${idx + 1}`}
                        className="product-img"
                        loading={idx === 0 ? "lazy" : "eager"}
                        style={{
                            position: idx === 0 ? 'relative' : 'absolute',
                            top: 0, 
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: (hoverIndex === idx || (idx === 0 && !isHovering)) ? 1 : 0,
                            transition: 'opacity 0.2s ease-in-out',
                            zIndex: hoverIndex === idx ? 2 : 1
                        }}
                    />
                ))}
                
                {images.length > 1 && isHovering && (
                    <>
                        <button 
                            onClick={handlePrev}
                            style={{
                                position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
                                background: 'rgba(12, 12, 14, 0.6)', color: 'white', border: 'none', borderRadius: '50%',
                                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 20, backdropFilter: 'blur(4px)'
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={handleNext}
                            style={{
                                position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)',
                                background: 'rgba(12, 12, 14, 0.6)', color: 'white', border: 'none', borderRadius: '50%',
                                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', zIndex: 20, backdropFilter: 'blur(4px)'
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
                
                {images.length > 1 && isHovering && (
                    <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px', zIndex: 10 }}>
                        {images.map((_, idx) => (
                            <div 
                                key={idx} 
                                style={{
                                    height: '2px',
                                    width: '12px',
                                    background: hoverIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                                    borderRadius: '1px',
                                    transition: 'background 0.2s ease'
                                }}
                            />
                        ))}
                    </div>
                )}

                {product.tags && product.tags.length > 0 && (
                    <div className="card-overlay">
                        <span className="badge-tag">{product.tags[0]}</span>
                    </div>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
            <p className="product-desc-preview" dangerouslySetInnerHTML={{ __html: product.description }}></p>
        )}

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
