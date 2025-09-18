import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccessPage = () => {
    const { orderId } = useParams(); // خواندن شماره سفارش از URL

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main' }} />
                <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
                    سفارش شما با موفقیت ثبت شد!
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    شماره سفارش شما: <strong>{orderId}</strong>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    می‌توانید وضعیت سفارش خود را از پنل کاربری پیگیری کنید.
                </Typography>
                <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 4 }}>
                    بازگشت به صفحه اصلی
                </Button>
            </Paper>
        </Container>
    );
};

export default OrderSuccessPage;