import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    const isAdmin = user?.role?.includes('Admin');

    if (!isLoggedIn || !isAdmin) {
        // اگر کاربر لاگین نکرده یا ادمین نیست، به صفحه اصلی هدایت کن
        return <Navigate to="/" />;
    }
    return children;
};

export default AdminRoute;