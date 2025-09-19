import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, roles } = useAuth();
    const location = useLocation();

    // وضعیت ۱: هنوز در حال بررسی وضعیت لاگین هستیم (user هنوز null است)
    // این حالت بسیار مهم است تا از ریدایرکت های ناخواسته جلوگیری شود
    if (isLoggedIn === undefined) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // وضعیت ۲: کاربر لاگین کرده و نقش "Admin" را دارد
    const isAdmin = roles.includes('Admin');
    if (isLoggedIn && isAdmin) {
        return children; // اجازه دسترسی و نمایش داشبورد ادمین
    }

    // وضعیت ۳: کاربر لاگین نکرده یا نقش ادمین را ندارد
    // کاربر به صفحه لاگین هدایت می شود
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;
