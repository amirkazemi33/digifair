import api from './api';

export const getProducts = () => {
    return api.get('/products');
};

// --- این تابع جدید اضافه می شود ---
export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};