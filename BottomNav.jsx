import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // در آینده بر اساس کلیک کاربر، او را به صفحات مختلف هدایت می کنیم
        switch (newValue) {
            case 0:
                navigate('/'); // صفحه اصلی
                break;
            case 1:
                // navigate('/cart'); // صفحه سبد خرید
                break;
            case 2:
                // navigate('/orders'); // صفحه سفارشات
                break;
            case 3:
                navigate('/login'); // صفحه ورود/پروفایل
                break;
            default:
                navigate('/');
        }
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                // این فوتر فقط در اندازه موبایل و تبلت (xs, sm) نمایش داده می شود
                display: { xs: 'block', md: 'none' }
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={handleChange}
            >
                <BottomNavigationAction label="خانه" icon={<HomeIcon />} />
                <BottomNavigationAction
                    label="سبد خرید"
                    icon={
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    }
                />
                <BottomNavigationAction label="سفارش‌ها" icon={<ReceiptLongIcon />} />
                <BottomNavigationAction label="حساب کاربری" icon={<AccountCircleIcon />} />
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;