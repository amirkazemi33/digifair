import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// تابع کمکی برای استخراج نقش ها از توکن
// این تابع هر دو نوع نام گذاری استاندارد و ساده را بررسی می کند
const getRolesFromToken = (decodedToken) => {
    if (!decodedToken) return [];

    // نام استاندارد نقش در ASP.NET Core
    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // نام ساده "role"
    const simpleRoleClaim = decodedToken.role;

    let roles = [];
    if (roleClaim) {
        // نقش می تواند یک رشته تنها یا آرایه ای از رشته ها باشد
        roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    } else if (simpleRoleClaim) {
        roles = Array.isArray(simpleRoleClaim) ? simpleRoleClaim : [simpleRoleClaim];
    }
    return roles;
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const loadUserFromToken = (token) => {
        try {
            if (typeof token !== 'string' || token.split('.').length !== 3) {
                localStorage.removeItem('authToken');
                return;
            }
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                setUser(decodedToken);
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error("Failed to decode token", error);
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            loadUserFromToken(token);
        }
    }, []);

    const login = (token) => {
        console.log("Received Token:", token); 
        try {
            if (typeof token !== 'string') {
                throw new Error("Received invalid token from server.");
            }
            localStorage.setItem('authToken', token);
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);

            // --- تغییر اصلی اینجاست ---
            const roles = getRolesFromToken(decodedToken);
            const isAdmin = roles.includes('Admin');

            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            localStorage.removeItem('authToken');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const roles = getRolesFromToken(user);
    const isLoggedIn = !!user;
    const isVendor = roles.includes('Vendor');

    return (
        <AuthContext.Provider value={{ user, roles, login, logout, isLoggedIn, isVendor }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

