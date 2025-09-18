import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AppBar, Toolbar, Button, Box, TextField, InputAdornment, Menu, MenuItem, IconButton, Tooltip, Divider, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as DigifairLogo } from '../assets/LOGO-full.svg';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { isLoggedIn, logout, isVendor, user } = useAuth();
    const { cartCount } = useCart();
    const isAdmin = user?.role?.includes('Admin');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [langMenuAnchorEl, setLangMenuAnchorEl] = useState(null);

    const handleUserMenu = (event) => setUserMenuAnchorEl(event.currentTarget);
    const handleLangMenu = (event) => setLangMenuAnchorEl(event.currentTarget);
    const handleCloseUserMenu = () => setUserMenuAnchorEl(null);
    const handleCloseLangMenu = () => setLangMenuAnchorEl(null);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        handleCloseLangMenu();
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleCloseUserMenu();
    }

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>

                {/* بخش راست: لوگوی دیجی‌فیر */}
                <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <DigifairLogo style={{ height: '40px', width: 'auto' }} />
                </Box>

                {/* بخش وسط: باکس جستجو */}
                <Box sx={{ flexGrow: 1, mx: { xs: 2, md: 4 } }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder={t('searchPlaceholder')}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* بخش چپ: دکمه های زبان و ورود/منوی کاربری */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="تغییر زبان">
                        <IconButton onClick={handleLangMenu} color="inherit">
                            <LanguageIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu anchorEl={langMenuAnchorEl} open={Boolean(langMenuAnchorEl)} onClose={handleCloseLangMenu}>
                        <MenuItem onClick={() => changeLanguage('fa')}>{t('persian')}</MenuItem>
                        <MenuItem onClick={() => changeLanguage('en')}>{t('english')}</MenuItem>
                        <MenuItem onClick={() => changeLanguage('ar')}>{t('arabic')}</MenuItem>
                        <MenuItem onClick={() => changeLanguage('zh')}>{t('chinese')}</MenuItem>
                        <MenuItem onClick={() => changeLanguage('de')}>{t('german')}</MenuItem>
                    </Menu>

                    {/* آیکون سبد خرید که فقط برای کاربران لاگین کرده نمایش داده می شود */}
                    {isLoggedIn && !isVendor && (
                        <IconButton color="inherit" onClick={() => navigate('/cart')}>
                            <Badge badgeContent={cartCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {isLoggedIn ? (
                        <>
                            <IconButton size="large" onClick={handleUserMenu} color="inherit">
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={userMenuAnchorEl}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(userMenuAnchorEl)}
                                onClose={handleCloseUserMenu}
                            >
                                {isAdmin && <MenuItem onClick={() => handleNavigate('/admin/dashboard')}>پنل مدیریت</MenuItem>}
                                {isVendor ? (
                                    // --- منوی فروشنده ---
                                    [
                                        <MenuItem key="profile" onClick={() => handleNavigate('/profile')}>{t('userProfile')}</MenuItem>,
                                        <MenuItem key="vendor-panel" onClick={() => handleNavigate('/vendor/dashboard')}>{t('vendorPanel')}</MenuItem>,
                                        <Divider key="divider" />,
                                        <MenuItem key="logout" onClick={handleLogout}>{t('logout')}</MenuItem>
                                    ]
                                ) : (
                                    // --- منوی خریدار ---
                                    [
                                        <MenuItem key="profile" onClick={() => handleNavigate('/profile')}>{t('userProfile')}</MenuItem>,
                                        <MenuItem key="become-vendor" onClick={() => handleNavigate('/profile')}>فروشنده شوید</MenuItem>,
                                        <Divider key="divider" />,
                                        <MenuItem key="logout" onClick={handleLogout}>{t('logout')}</MenuItem>
                                    ]
                                )}
                            </Menu>
                        </>
                    ) : (
                        <Button variant="contained" onClick={() => navigate('/login')}>
                            {t('loginRegister')}
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;