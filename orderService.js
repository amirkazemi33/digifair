import api from './api';

export const createOrder = (orderData) => {
    // orderData شامل آیتم های سبد خرید خواهد بود
    return api.post('/orders', orderData);
};