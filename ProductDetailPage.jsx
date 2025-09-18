import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { Container, Grid, Box, Typography, Button, Alert } from '@mui/material';
import LogoLoader from '../components/LogoLoader';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams(); // خواندن id محصول از آدرس URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                setProduct(response.data);
            } catch (err) {
                setError('محصول مورد نظر یافت نشد یا در دریافت اطلاعات خطایی رخ داد.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]); // هر زمان id در URL تغییر کرد، این تابع دوباره اجرا می شود

    const handleAddToCart = () => {
        if (product) {
            addToCart(product); // ۳. اضافه کردن محصول فعلی به سبد خرید
            alert(`"${product.name}" با موفقیت به سبد خرید اضافه شد.`);
        }
    };

    if (loading) return <LogoLoader />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!product) return null;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                {/* بخش عکس محصول */}
                <Grid item xs={12} md={6}>
                    <Box component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 500,
                            borderRadius: 3,
                            boxShadow: 3
                        }}
                        src={product.imageUrl || 'https://via.placeholder.com/600x400'}
                        alt={product.name}
                    />
                </Grid>
                {/* بخش توضیحات محصول */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h1" variant="h3" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {product.description}
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
                        {product.price.toLocaleString('fa-IR')} تومان
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            sx={{ width: '100%', py: 2 }}
                        >
                            افزودن به سبد خرید
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetailPage;