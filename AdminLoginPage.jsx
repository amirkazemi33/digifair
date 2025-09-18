import React, { useState } from 'react';
import { generateOtp, verifyOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';

const AdminLoginPage = () => {
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    const handlePhoneNumberSubmit = async (e) => {
        e.preventDefault();
        try {
            await generateOtp(phoneNumber);
            setStep(2);
        } catch (err) {
            setError('خطا در ارسال کد.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp(phoneNumber, otp);
            // پس از ورود، context نقش را چک کرده و هدایت می کند
            auth.login(response.data.token);
        } catch (err) {
            setError('کد وارد شده صحیح نیست.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    ورود به پنل مدیریت دیجی‌فیر
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}

                {step === 1 ? (
                    <Box component="form" onSubmit={handlePhoneNumberSubmit} sx={{ mt: 1 }}>
                        <TextField fullWidth required margin="normal" label="شماره موبایل ادمین" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>ارسال کد</Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 1 }}>
                        <Typography>کد ارسال شده به شماره {phoneNumber} را وارد کنید.</Typography>
                        <TextField fullWidth required margin="normal" label="کد تایید" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>ورود به پنل</Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default AdminLoginPage;