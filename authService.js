import api from './api';

export const generateOtp = (phoneNumber) => {
    return api.post('/auth/generate-otp', { phoneNumber });
};

export const verifyOtp = (phoneNumber, otpCode) => {
    return api.post('/auth/verify-otp', { phoneNumber, otpCode });
};
export const registerVendor = (vendorData) => {
    // vendorData یک آبجکت شامل: phoneNumber, storeName, landlineNumber, address
    return api.post('/auth/register-vendor', vendorData);
};