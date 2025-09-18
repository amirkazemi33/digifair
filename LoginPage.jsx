import React, { useState, useEffect } from 'react';
// ۱. سرویس جدید را ایمپورت می کنیم
import { generateOtp, verifyOtp, registerVendor } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// ۲. کامپوننت های جدید MUI را ایمپورت می کنیم
import { TextField, Button, Box, Typography, Container, Alert, FormControlLabel, Checkbox, Collapse } from '@mui/material';

const LoginPage = () => {
    // استیت‌های قبلی
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const auth = useAuth();
    const navigate = useNavigate();

    // ۳. استیت‌های جدید برای فرم فروشنده
    const [isVendorRegistration, setIsVendorRegistration] = useState(false);
    const [vendorForm, setVendorForm] = useState({
        storeName: '',
        landlineNumber: '',
        address: '',
    });

    // افکت تایمر بدون تغییر باقی می ماند
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // مدیریت تغییرات در فرم فروشنده
    const handleVendorFormChange = (e) => {
        const { name, value } = e.target;
        setVendorForm(prev => ({ ...prev, [name]: value }));
    };

    // ۴. منطق اصلی ارسال فرم
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isVendorRegistration) {
                // اگر کاربر تیک فروشندگی را زده باشد
                const vendorData = { phoneNumber, ...vendorForm };
                await registerVendor(vendorData);
            } else {
                // در غیر این صورت، ورود یا ثبت نام عادی
                await generateOtp(phoneNumber);
            }
            // در هر دو صورت، به مرحله ورود کد OTP می رویم
            setStep(2);
            setTimer(120);
        } catch (err) {
            setError(err.response?.data?.message || 'خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید.');
            console.error(err);
        }
        setLoading(false);
    };

    // منطق تایید کد OTP بدون تغییر باقی می ماند
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await verifyOtp(phoneNumber, otp);
            auth.login(response.data.token);
            navigate('/');
        } catch (err) {
            setError('کد وارد شده صحیح نیست یا منقضی شده است.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    ورود / ثبت‌نام در دیجی‌فیر
                </Typography>

                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

                {/* مرحله اول: ورود شماره موبایل و فرم فروشندگی */}
                {step === 1 && (
                    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="شماره موبایل"
                            name="phoneNumber"
                            autoComplete="tel"
                            autoFocus
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <FormControlLabel
                            control={<Checkbox checked={isVendorRegistration} onChange={(e) => setIsVendorRegistration(e.target.checked)} />}
                            label="می‌خواهم به عنوان فروشنده ثبت‌نام کنم"
                        />

                        {/* فرم آکاردئونی فروشنده */}
                        <Collapse in={isVendorRegistration}>
                            <TextField margin="normal" required={isVendorRegistration} fullWidth label="نام فروشگاه" name="storeName" value={vendorForm.storeName} onChange={handleVendorFormChange} />
                            <TextField margin="normal" required={isVendorRegistration} fullWidth label="شماره تماس ثابت" name="landlineNumber" value={vendorForm.landlineNumber} onChange={handleVendorFormChange} />
                            <TextField margin="normal" required={isVendorRegistration} fullWidth label="آدرس فروشگاه" name="address" value={vendorForm.address} onChange={handleVendorFormChange} />
                        </Collapse>

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                        </Button>
                    </Box>
                )}

                {/* مرحله دوم: ورود کد OTP */}
                {step === 2 && (
                    <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
                        <Typography sx={{ textAlign: 'center' }}>
                            کد ۵ رقمی ارسال شده به شماره {phoneNumber} را وارد کنید.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="otp"
                            label="کد تایید"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                            {loading ? 'در حال بررسی...' : 'ورود به دیجی‌فیر'}
                        </Button>
                        {timer > 0 ? (
                            <Typography sx={{ textAlign: 'center' }}>
                                زمان باقی‌مانده: {timer} ثانیه
                            </Typography>
                        ) : (
                            <Button onClick={handleFormSubmit} fullWidth disabled={loading}>
                                ارسال مجدد کد
                            </Button>
                        )}
                        <Button fullWidth onClick={() => setStep(1)} sx={{ mt: 1 }}>
                            ویرایش شماره موبایل
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default LoginPage;