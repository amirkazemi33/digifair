import React from 'react';
import { Box, Typography, Avatar, Grid, Paper } from '@mui/material';

const CategoryIcons = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                دسته بندی خدمات
            </Typography>
            <Grid container spacing={{ xs: 2, md: 3 }}>
                {categories.map((category) => (
                    <Grid item key={category.id} xs={3} sm={2} sx={{ textAlign: 'center', cursor: 'pointer' }}>
                        <Paper elevation={0} sx={{ p: 1, backgroundColor: 'transparent' }}>
                            <Avatar
                                src={category.imageUrl}
                                alt={category.name}
                                sx={{
                                    width: { xs: 56, sm: 72 },
                                    height: { xs: 56, sm: 72 },
                                    margin: 'auto',
                                    border: '1px solid #e0e0e0'
                                }}
                            />
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 'medium' }}>
                                {category.name}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CategoryIcons;