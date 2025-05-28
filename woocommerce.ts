import axios from 'axios';

const API_URL = 'https://your-store.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_47e47cf0d3ca852311645165ef28abdd2e9ae75f';
const CONSUMER_SECRET = 'cs_ad42e334bd3b929d3d6359856a16b23bb0b7c5de';

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET
      },
      params: {
        per_page: 50,
        orderby: 'date',
        order: 'desc'
      }
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};