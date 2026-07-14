import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const cachedUser = localStorage.getItem('sneek_admin_user');
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setIsAdmin(true);
        }
    }, []);

    const login = (username, password) => {
        // Simple admin check
        if (username.toLowerCase() === 'admin' && password === 'password123') {
            const userData = { username: 'Admin', role: 'Store Owner' };
            localStorage.setItem('sneek_admin_user', JSON.stringify(userData));
            setUser(userData);
            setIsAdmin(true);
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials. Try admin / password123' };
    };

    const logout = () => {
        localStorage.removeItem('sneek_admin_user');
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
