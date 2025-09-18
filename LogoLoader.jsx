import React from 'react';
// SVG را به عنوان یک کامپوننت React وارد می کنیم
import { ReactComponent as DigifairLogo } from '../assets/logo.svg';
import './LogoLoader.css'; // فایل استایل مخصوص این کامپوننت

const LogoLoader = () => {
    return (
        <div className="logo-loader-container">
            <DigifairLogo className="pulsing-logo" />
        </div>
    );
};

export default LogoLoader;