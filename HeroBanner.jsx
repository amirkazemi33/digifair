import React from 'react';
import { Box, Card, CardMedia } from '@mui/material';

const HeroBanner = ({ banners }) => {
    if (!banners || banners.length === 0) return null;

    return (
        <Box sx={{ mb: 4 }}>
            {/* در آینده می توانیم اینجا یک اسلایدر قرار دهیم */}
            <Card>
                <CardMedia
                    component="img"
                    image={banners[0].imageUrl}
                    alt="بنر تبلیغاتی دیجی فیر"
                    sx={{ width: '100%', height: 'auto', maxHeight: { xs: '200px', md: '350px' }, objectFit: 'cover' }}                />
            </Card>
        </Box>
    );
};
export default HeroBanner;