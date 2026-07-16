import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all products from Supabase
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addNewProduct = async (prod) => {
        const newProd = {
            name: prod.name || 'Unnamed Product',
            price: parseFloat(prod.price) || 0,
            category: prod.category || 'Uncategorized',
            description: prod.description || '',
            sizes: Array.isArray(prod.sizes)
                ? prod.sizes
                : (prod.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
            colors: Array.isArray(prod.colors)
                ? prod.colors
                : (prod.colors || '').split(',').map(c => c.trim()).filter(Boolean),
            tags: Array.isArray(prod.tags)
                ? prod.tags
                : (prod.tags || '').split(',').map(t => t.trim()).filter(Boolean),
            img_url: prod.img || prod.img_url || '',
            featured: !!prod.featured,
        };

        const { data, error } = await supabase
            .from('products')
            .insert([newProd])
            .select()
            .single();

        if (error) {
            console.error('Add product error:', error);
            return null;
        }
        setProducts(prev => [data, ...prev]);
        return data;
    };

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const updateProduct = async (id, updatedFields) => {
        const patch = {
            ...updatedFields,
            price: parseFloat(updatedFields.price) || 0,
            sizes: Array.isArray(updatedFields.sizes)
                ? updatedFields.sizes
                : (updatedFields.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
            colors: Array.isArray(updatedFields.colors)
                ? updatedFields.colors
                : (updatedFields.colors || '').split(',').map(c => c.trim()).filter(Boolean),
        };

        const { data, error } = await supabase
            .from('products')
            .update(patch)
            .eq('id', id)
            .select()
            .single();

        if (!error && data) {
            setProducts(prev => prev.map(p => p.id === id ? data : p));
        }
    };

    const bulkUploadProducts = async (newProductsList) => {
        const processed = newProductsList.map(prod => ({
            name: prod.name || 'Unnamed Product',
            price: parseFloat(prod.price) || 0,
            category: prod.category || 'Uncategorized',
            description: prod.description || '',
            sizes: Array.isArray(prod.sizes)
                ? prod.sizes
                : (prod.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
            colors: Array.isArray(prod.colors)
                ? prod.colors
                : (prod.colors || '').split(',').map(c => c.trim()).filter(Boolean),
            tags: Array.isArray(prod.tags)
                ? prod.tags
                : (prod.tags || '').split(',').map(t => t.trim()).filter(Boolean),
            img_url: prod.img || prod.img_url || '',
            featured: !!prod.featured,
        }));

        const { data, error } = await supabase
            .from('products')
            .insert(processed)
            .select();

        if (!error && data) {
            setProducts(prev => [...data, ...prev]);
        }
        return { data, error };
    };

    return (
        <ProductsContext.Provider value={{
            products,
            loading,
            error,
            addNewProduct,
            deleteProduct,
            updateProduct,
            bulkUploadProducts,
            refetchProducts: fetchProducts,
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
