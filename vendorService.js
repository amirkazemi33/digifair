import api from './api';

// ایجاد پروفایل فروشندگی برای کاربر لاگین کرده
export const createVendorProfile = (vendorData) => {
    return api.post('/vendors', vendorData);
};