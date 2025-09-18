import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getHomepageBanners } from '../services/contentService';
import LogoLoader from '../components/LogoLoader';
import HeroBanner from '../components/HeroBanner';
import CategoryIcons from '../components/CategoryIcons';
import { Typography, Container, Box, Grid, Card, CardContent, CardMedia, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [pageData, setPageData] = useState({
        products: [],
        categories: [],
        banners: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                // تمام درخواست ها را به صورت همزمان ارسال می کنیم تا صفحه سریعتر لود شود
                const [productsRes, categoriesRes, bannersRes] = await Promise.all([
                    getProducts(),
                    getCategories(),
                    getHomepageBanners()
                ]);
                setPageData({
                    products: productsRes.data,
                    categories: categoriesRes.data,
                    banners: bannersRes.data
                });
            } catch (err) {
                setError('خطا در دریافت اطلاعات صفحه.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, []); // آرایه خالی یعنی این افکت فقط یک بار بعد از رندر اولیه اجرا می شود

    if (loading) return <LogoLoader />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container component="main" maxWidth="lg">
            {/* بخش ۱: بنر اصلی */}
            <HeroBanner banners={pageData.banners} />

            {/* بخش ۲: آیکون های دسته بندی */}
            <CategoryIcons categories={pageData.categories} />

            {/* بخش ۳: محصولات و خدمات */}
            <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                محصولات و خدمات
            </Typography>
            {pageData.products.length === 0 ? (
                <Typography sx={{ textAlign: 'center', mt: 5 }}>
                    هیچ محصولی برای نمایش وجود ندارد.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {pageData.products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                     component="img"
                                     height="140"
                                     image={product.imageUrl || 'https://via.placeholder.com/300x140'}
                                     alt={product.name}
                                 />
                                 <CardContent sx={{ flexGrow: 1 }}>
                                      <Typography gutterBottom variant="h5" component="div">
                                        {product.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                      </Typography>
                                      <Typography variant="h6" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            {product.price.toLocaleString('fa-IR')} تومان
                                     </Typography>
                                 </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};
export default HomePage;