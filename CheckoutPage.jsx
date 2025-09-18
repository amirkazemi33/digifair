import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button, TextField, Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState({
        recipientName: '',
        boothNumber: '' // شماره غرفه برای تحویل
    });

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        const orderData = {
            orderItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await createOrder(orderData);
            const newOrderId = response.data.orderId;
            clearCart(); // پاک کردن سبد خرید پس از ثبت سفارش موفق
            navigate(`/order-success/${newOrderId}`); // هدایت به صفحه تشکر
        } catch (err) {
            setError('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>نهایی کردن خرید</Typography>
            <Grid container spacing={4}>
                {/* بخش اطلاعات تحویل و پرداخت */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>اطلاعات تحویل در محل نمایشگاه</Typography>
                        <TextField
                            label="نام تحویل گیرنده"
                            name="recipientName"
                            value={deliveryInfo.recipientName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="شماره غرفه"
                            name="boothNumber"
                            value={deliveryInfo.boothNumber}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </Paper>
                </Grid>

                {/* بخش خلاصه سفارش */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>خلاصه سفارش</Typography>
                        <List disablePadding>
                            {cartItems.map(item => (
                                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary={item.name} secondary={`تعداد: ${item.quantity}`} />
                                    <Typography variant="body2">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</Typography>
                                </ListItem>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <ListItem sx={{ py: 1, px: 0 }}>
                                <ListItemText primary="مبلغ کل" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {totalAmount.toLocaleString('fa-IR')} تومان
                                </Typography>
                            </ListItem>
                        </List>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, py: 1.5 }}
                            onClick={handlePlaceOrder}
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? 'در حال ثبت...' : 'پرداخت و نهایی کردن سفارش'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;