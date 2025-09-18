import api from './api';

export const getHomepageBanners = () => {
    return api.get('/content/homepage-banners');
};