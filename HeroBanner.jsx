import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';

const HeroBanner = ({ banners }) => {
    // مرحله ۱: چک میکنیم که آیا banners یک آرایه معتبر است یا نه
    if (!Array.isArray(banners) || banners.length === 0) {
        // اگر آرایه نبود یا خالی بود، چیزی نمایش نده
        return null;
    }

    // مرحله ۲: اولین آیتم معتبر در آرایه را پیدا میکنیم
    const firstValidBanner = banners.find(banner => banner && banner.imageUrl);

    // مرحله ۳: اگر هیچ بنر معتبری پیدا نشد، چیزی نمایش نده
    if (!firstValidBanner) {
        return null;
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Card>
                <CardMedia
                    component="img"
                    // از اولین بنر معتبر پیدا شده استفاده میکنیم
                    image={firstValidBanner.imageUrl}
                    alt="بنر تبلیغاتی دیجی فیر"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: { xs: '200px', md: '350px' },
                        objectFit: 'cover'
                    }}
                />
            </Card>
        </Box>
    );
};

export default HeroBanner;
