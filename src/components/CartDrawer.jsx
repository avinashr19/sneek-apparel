import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';

export default function CartDrawer({ addToast }) {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    const [checkoutStep, setCheckoutStep] = useState('idle'); // idle, details, review, success
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setCheckoutStep('details');
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        if (!customerName.trim() || !customerPhone.trim()) {
            addToast('Please enter both your name and phone number.', 'error');
            return;
        }
        setCheckoutStep('review');
    };

    const handleConfirmPayment = async () => {
        const productTextList = cart.map((item, idx) => {
            return `${idx + 1}. ${item.product.name}\n   Size: ${item.selectedSize}\n   Color: ${item.selectedColor}\n   Qty: ${item.quantity}`;
        }).join('\n\n');

        const msgText = `Hello SNEEK,\n\nI would like to enquire about these products.\n\nCustomer Details:\nName: ${customerName}\nPhone: ${customerPhone}\n\nProducts:\n\n${productTextList}\n\nPlease contact me regarding availability.\n\nThank you.`;

        const cleanNum = (shopSettings.whatsapp || '+91 9876543210').replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(msgText)}`;
        
        window.open(waUrl, '_blank');

        // Log order to Supabase
        const orderItems = cart.map(item => ({
            name: item.product.name,
            size: item.selectedSize,
            color: item.selectedColor,
            qty: item.quantity,
            price: item.product.price,
        }));
        await supabase.from('order_logs').insert([{
            customer_name: customerName,
            customer_phone: customerPhone,
            items: orderItems,
            whatsapp_sent: true,
        }]);

        setCheckoutStep('success');
        addToast('Inquiry launched on WhatsApp.');
    };

    const handleCloseSuccess = () => {
        clearCart();
        setCustomerName('');
        setCustomerPhone('');
        setCheckoutStep('idle');
        setIsCartOpen(false);
    };

    const { shopSettings } = useSettings();
    const threshold = parseFloat(shopSettings.freeShippingThreshold) || 9999;
    const shipping = subtotal > threshold ? 0 : 150;
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + shipping + tax;

    return (
        <>
            <div className={`cart-drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => {
                if (checkoutStep === 'idle') setIsCartOpen(false);
            }}>
                <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="cart-drawer-header">
                        <h2>Your Bag {cart.length > 0 && `(${cart.length})`}</h2>
                        <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="cart-items-list">
                        {cart.length === 0 ? (
                            <div className="cart-empty-state">
                                <p>Your bag is empty.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => setIsCartOpen(false)}
                                    style={{ marginTop: '20px' }}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div className="cart-item" key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}>
                                    <img src={item.product.img} alt={item.product.name} className="cart-item-img" />
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.product.name}</h4>
                                        <span className="cart-item-meta">
                                            Size: {item.selectedSize} / Color: {item.selectedColor}
                                        </span>

                                        <div className="cart-item-controls">
                                            <div className="quantity-selector">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)}
                                                    id={`qty-dec-${item.product.id}`}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="qty-val">{item.quantity}</span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)}
                                                    id={`qty-inc-${item.product.id}`}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="cart-item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                                                <button
                                                    className="remove-item-btn"
                                                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                                                    title="Remove item"
                                                    id={`cart-remove-${item.product.id}`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="cart-drawer-footer">
                            <div className="subtotal-row">
                                <span>Subtotal</span>
                                <span className="subtotal-val">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Shipping and taxes calculated at checkout. Free shipping on orders over ₹{threshold}.
                            </p>
                            <button
                                className="btn-accent checkout-btn"
                                onClick={handleCheckout}
                                id="checkout-btn"
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            {checkoutStep !== 'idle' && (
                <div className="modal-backdrop">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {checkoutStep === 'details' ? 'Customer Details' : checkoutStep === 'review' ? 'Review Inquiry' : 'Inquiry Sent'}
                            </h3>
                            {checkoutStep !== 'success' && (
                                <button className="modal-close-btn" onClick={() => setCheckoutStep('idle')}>
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="modal-body">
                            {checkoutStep === 'details' && (
                                <form onSubmit={handleDetailsSubmit} className="add-product-form">
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                                        Enter your details to generate a custom product inquiry on WhatsApp.
                                    </p>
                                    
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" htmlFor="cust-name">Full Name *</label>
                                        <input 
                                            type="text" 
                                            id="cust-name" 
                                            className="form-input" 
                                            placeholder="e.g. Avinash" 
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: '12px 0 20px' }}>
                                        <label className="form-label" htmlFor="cust-phone">WhatsApp Mobile Number *</label>
                                        <input 
                                            type="tel" 
                                            id="cust-phone" 
                                            className="form-input" 
                                            placeholder="e.g. 9876543210" 
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-accent" style={{ width: '100%' }} id="details-submit-btn">
                                        Continue To Review
                                    </button>
                                </form>
                            )}

                            {checkoutStep === 'review' && (
                                <div>
                                    <h4 style={{ textTransform: 'uppercase', marginBottom: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        Inquirer details
                                    </h4>
                                    <div 
                                        style={{ 
                                            background: 'var(--bg-input)', 
                                            padding: '12px 16px', 
                                            borderRadius: 'var(--radius)', 
                                            border: '1px solid var(--border-luxe)',
                                            fontSize: '13px',
                                            lineHeight: '1.6',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        <div><strong>Name:</strong> {customerName}</div>
                                        <div><strong>Phone:</strong> {customerPhone}</div>
                                    </div>

                                    <h4 style={{ textTransform: 'uppercase', marginBottom: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        Products List
                                    </h4>
                                    <div 
                                        style={{ 
                                            background: 'var(--bg-input)', 
                                            padding: '12px 16px', 
                                            borderRadius: 'var(--radius)', 
                                            border: '1px solid var(--border-luxe)',
                                            fontSize: '13px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            maxHeight: '180px',
                                            overflowY: 'auto',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        {cart.map((item, idx) => (
                                            <div key={idx} style={{ borderBottom: idx !== cart.length - 1 ? '1px solid var(--border-luxe)' : 'none', paddingBottom: idx !== cart.length - 1 ? '8px' : 0 }}>
                                                <div><strong>{idx + 1}. {item.product.name}</strong></div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                    Size: {item.selectedSize} // Color: {item.selectedColor} // Qty: {item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="checkout-details-table">
                                        <div className="checkout-details-row">
                                            <span>Items Subtotal</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="checkout-details-row">
                                            <span>Estimated Shipping</span>
                                            <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="checkout-details-row" style={{ fontWeight: '700', borderTop: '1px solid var(--border-luxe)', paddingTop: '8px', marginTop: '4px' }}>
                                            <span>Grand Total</span>
                                            <span>₹{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {checkoutStep === 'success' && (
                                <div className="checkout-confirm-modal" style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <CheckCircle size={60} style={{ color: '#25D366', margin: '0 auto 16px' }} />
                                    <h2>INQUIRY INITIATED</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', margin: '12px 0 20px' }}>
                                        Your enquiry draft has been prepared and launched in a new WhatsApp tab.<br />
                                        Please submit the message in WhatsApp to notify the owner.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            {checkoutStep === 'details' && (
                                <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setCheckoutStep('idle')}>
                                    Cancel
                                </button>
                            )}

                            {checkoutStep === 'review' && (
                                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                    <button className="btn-secondary" onClick={() => setCheckoutStep('details')} style={{ flex: 1 }}>
                                        Back
                                    </button>
                                    <button 
                                        className="btn-accent" 
                                        onClick={handleConfirmPayment} 
                                        id="confirm-payment-btn" 
                                        style={{ 
                                            flex: 2, 
                                            background: '#25D366', 
                                            color: '#ffffff', 
                                            border: '1px solid #20ba5a', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            gap: '8px' 
                                        }}
                                    >
                                        Send Inquiry on WhatsApp
                                    </button>
                                </div>
                            )}

                            {checkoutStep === 'success' && (
                                <button className="btn-accent" onClick={handleCloseSuccess} id="success-close-btn" style={{ width: '100%' }}>
                                    Keep Shopping
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
