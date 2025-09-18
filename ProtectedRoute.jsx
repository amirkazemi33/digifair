import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();

    if (!auth.isLoggedIn) {
        // اگر کاربر وارد نشده بود، او را به صفحه ورود هدایت کن
        return <Navigate to="/login" />;
    }

    // اگر کاربر وارد شده بود، محتوای صفحه درخواستی را نمایش بده
    return children;
};

export default ProtectedRoute;