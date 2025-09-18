import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';
import ImageUpload from '../components/ImageUpload'; // کامپوننت آپلود را ایمپورت می کنیم
import { createProduct } from '../services/productService'; // فرض می کنیم این سرویس وجود دارد

const VendorProductsPage = () => {
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: 0,
        imageUrl: '', // URL عکس در اینجا ذخیره می شود
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({ ...prev, [name]: value }));
    };

    // این تابع از کامپوننت ImageUpload فراخوانی می شود
    const handleImageUploadSuccess = (url) => {
        setProductForm(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await createProduct(productForm); // ارسال کل فرم (شامل URL عکس) به API
            setSuccess('محصول با موفقیت ایجاد شد.');
            // پاک کردن فرم پس از موفقیت
            setProductForm({ name: '', description: '', price: 0, imageUrl: '' });
        } catch (err) {
            setError('خطا در ایجاد محصول.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>مدیریت محصولات</Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6">افزودن محصول جدید</Typography>

                <TextField name="name" label="نام محصول" value={productForm.name} onChange={handleChange} fullWidth required margin="normal" />
                <TextField name="description" label="توضیحات" value={productForm.description} onChange={handleChange} fullWidth multiline rows={4} margin="normal" />
                <TextField name="price" label="قیمت (تومان)" type="number" value={productForm.price} onChange={handleChange} fullWidth required margin="normal" />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>عکس محصول</Typography>
                <ImageUpload onUploadSuccess={handleImageUploadSuccess} />

                {productForm.imageUrl && <Typography variant="caption">عکس آپلود شد.</Typography>}

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
                    {loading ? 'در حال ذخیره...' : 'ذخیره محصول'}
                </Button>
            </Box>
        </Container>
    );
};

export default VendorProductsPage;