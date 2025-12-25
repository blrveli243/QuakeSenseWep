import React, {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.access_token);
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};