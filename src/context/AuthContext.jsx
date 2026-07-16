import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session from sessionStorage (page refresh safe, not cross-tab)
    useEffect(() => {
        const cached = sessionStorage.getItem('sneek_admin_session');
        if (cached) {
            setUser(JSON.parse(cached));
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // Look up admin user in Supabase admin_users table
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username.toLowerCase())
            .eq('password_hash', password) // plain text for now
            .single();

        if (error || !data) {
            return { success: false, error: 'Invalid credentials.' };
        }

        const userData = { id: data.id, username: data.username, role: data.role };
        sessionStorage.setItem('sneek_admin_session', JSON.stringify(userData));
        setUser(userData);
        setIsAdmin(true);
        return { success: true };
    };

    const logout = () => {
        sessionStorage.removeItem('sneek_admin_session');
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
