import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    setUser(decodedToken);
                } else {
                    localStorage.removeItem('authToken');
                }
            }
        } catch (error) {
            console.error("Failed to decode token", error);
            localStorage.removeItem('authToken');
        }
    }, []);

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        localStorage.setItem('authToken', token);

        const isAdmin = decodedToken?.role?.includes('Admin');
        if (isAdmin) {
            navigate('/admin/dashboard');
        } else {
            navigate('/');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    }; 

    const isLoggedIn = !!user;
    const isVendor = user?.role?.includes('Vendor');

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isVendor }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};