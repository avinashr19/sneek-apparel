import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const cached = localStorage.getItem('sneek_cart');
        if (cached) {
            setCart(JSON.parse(cached));
        }
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('sneek_cart', JSON.stringify(newCart));
    };

    const addToCart = (product, quantity = 1, selectedSize, selectedColor) => {
        const existingIndex = cart.findIndex(
            item =>
                item.product.id === product.id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
        );

        if (existingIndex > -1) {
            const updated = [...cart];
            updated[existingIndex].quantity += quantity;
            saveCart(updated);
        } else {
            saveCart([...cart, { product, quantity, selectedSize, selectedColor }]);
        }

        // Automatically slide drawer open for micro-interaction feedback
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, selectedSize, selectedColor) => {
        const updated = cart.filter(
            item =>
                !(item.product.id === productId &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor)
        );
        saveCart(updated);
    };

    const updateQuantity = (productId, selectedSize, selectedColor, delta) => {
        const updated = cart.map(item => {
            if (
                item.product.id === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
            ) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        saveCart(updated);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            subtotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
