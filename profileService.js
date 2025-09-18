import api from './api';

// دریافت اطلاعات پروفایل کاربر لاگین کرده
export const getMyProfile = () => {
    return api.get('/profile/me');
};

// آپدیت اطلاعات پروفایل کاربر لاگین کرده
export const updateMyProfile = (profileData) => {
    return api.put('/profile/me', profileData);
};