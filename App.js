import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { useAuth } from './context/AuthContext';
import { Box, CssBaseline } from '@mui/material';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
    const auth = useAuth();

    return (
        <BrowserRouter>
            <CssBaseline />
            <Header />
            <Box
                component="main"
                sx={{
                    p: 3,
                    pb: { xs: 8, md: 3 }
                }}
            >
                <Routes>
                    <Route path="/manage" element={<AdminLoginPage />} />
                    <Route path="/login" element={auth.isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    {/* مسیرهای محافظت شده */}
                    <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

                    {/* مسیرهای ادمین */}
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
            </Box>
            <BottomNav />
        </BrowserRouter>
    );
}

export default App;