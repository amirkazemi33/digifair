import React from 'react';
import { useCart } from '../context/CartContext';
import { Container, Typography, Box, List, ListItem, ListItemText, IconButton, Button, Paper, Divider, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>سبد خرید شما</Typography>
            {cartCount === 0 ? (
                <Typography>سبد خرید شما خالی است.</Typography>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2}>
                            <List>
                                {cartItems.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={`${item.price.toLocaleString('fa-IR')} تومان`}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                                <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                            <Typography variant="h6">خلاصه سفارش</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                                <Typography>مجموع</Typography>
                                <Typography fontWeight="bold">{totalAmount.toLocaleString('fa-IR')} تومان</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/checkout')} // هدایت به صفحه پرداخت
                            >
                                ادامه فرآیند خرید
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default CartPage;