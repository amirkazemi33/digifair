import api from './api';

export const uploadImage = (file) => {
    // برای ارسال فایل، باید از FormData استفاده کنیم
    const formData = new FormData();
    formData.append('file', file);

    // هدر Content-Type را برای این درخواست خاص تغییر می دهیم
    return api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};