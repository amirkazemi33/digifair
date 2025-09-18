import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { uploadImage } from '../services/uploadService';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const ImageUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');
        setPreview(URL.createObjectURL(file)); // ایجاد یک پیش نمایش موقت

        try {
            const response = await uploadImage(file);
            const imageUrl = response.data.url;
            onUploadSuccess(imageUrl); // ارسال URL عکس به کامپوننت والد
        } catch (err) {
            setError('خطا در آپلود عکس.');
            console.error(err);
            setPreview(null); // حذف پیش نمایش در صورت خطا
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Button
                variant="outlined"
                component="label" // این باعث می شود دکمه مانند یک لیبل برای اینپوت عمل کند
                startIcon={<AddPhotoAlternateIcon />}
                disabled={uploading}
            >
                انتخاب عکس
                <input
                    type="file"
                    hidden
                    accept="image/*" // فقط فایل های تصویری را قبول می کند
                    onChange={handleFileChange}
                />
            </Button>

            {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}

            {preview && !error && (
                <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: 100, height: 100, mt: 2 }}
                />
            )}

            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        </Box>
    );
};

export default ImageUpload;