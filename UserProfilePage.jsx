import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../services/profileService';
import { createVendorProfile } from '../services/vendorService';
import { TextField, Button, Box, Typography, Container, Alert, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserProfilePage = () => {
    const { isVendor, logout } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        gender: '',
        dateOfBirth: '',
    });
    const [vendorData, setVendorData] = useState({
        storeName: '',
        landlineNumber: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getMyProfile();
                setProfileData(response.data);
            } catch (err) {
                setError('خطا در دریافت اطلاعات پروفایل.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await updateMyProfile(profileData);
            setSuccess('اطلاعات پروفایل با موفقیت به‌روز شد.');
        } catch (err) {
            setError('خطا در به‌روزرسانی پروفایل.');
        }
        setLoading(false);
    };

    const handleVendorChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    };

    const handleVendorSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await createVendorProfile(vendorData);
            setSuccess('درخواست شما برای فروشندگی ثبت شد. لطفاً برای اعمال تغییرات، یک بار خارج و دوباره وارد شوید.');
            // در حالت ایده آل، باید توکن کاربر را رفرش کنیم تا نقش جدید را دریافت کند
        } catch (err) {
            setError(err.response?.data || 'خطا در ثبت پروفایل فروشندگی.');
        }
        setLoading(false);
    };


    if (loading) return <Typography>در حال بارگذاری...</Typography>;

    return (
        <Container maxWidth="md">
            <Typography component="h1" variant="h4" gutterBottom>
                پروفایل کاربری
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Box component="form" onSubmit={handleProfileSubmit} sx={{ mb: 4 }}>
                <Typography component="h2" variant="h6">اطلاعات شخصی</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField name="firstName" label="نام" value={profileData.firstName || ''} onChange={handleProfileChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="lastName" label="نام خانوادگی" value={profileData.lastName || ''} onChange={handleProfileChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="phoneNumber" label="شماره تماس" value={profileData.phoneNumber || ''} fullWidth disabled />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="email" label="ایمیل" type="email" value={profileData.email || ''} onChange={handleProfileChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="address" label="آدرس" value={profileData.address || ''} onChange={handleProfileChange} fullWidth />
                    </Grid>
                    {/* فیلدهای جنسیت و تاریخ تولد را می توانید به همین شکل اضافه کنید */}
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
                    ذخیره تغییرات
                </Button>
            </Box>

            {/* بخش ارتقا به فروشنده، فقط برای خریداران نمایش داده می شود */}
            {!isVendor && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography component="h2" variant="h6">فروشنده شوید</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box component="form" onSubmit={handleVendorSubmit}>
                            <Typography>برای فروش محصولات خود در دیجی‌فیر، لطفاً اطلاعات زیر را تکمیل کنید.</Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="storeName" label="نام فروشگاه" value={vendorData.storeName} onChange={handleVendorChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="landlineNumber" label="شماره ثابت" value={vendorData.landlineNumber} onChange={handleVendorChange} required fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField name="address" label="آدرس فروشگاه" value={vendorData.address} onChange={handleVendorChange} required fullWidth />
                                </Grid>
                            </Grid>
                            <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
                                ثبت درخواست فروشندگی
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
        </Container>
    );
};

export default UserProfilePage;