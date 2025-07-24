import axios from 'axios';

/**
 * Fetches up to 50 recent WooCommerce orders, sorted by date descending.
 *
 * @param {Object} credentials - WooCommerce API credentials and base URL.
 * @param {string} credentials.url - The base WooCommerce API URL (e.g., https://your-website.com/wp-json/wc/v3).
 * @param {string} credentials.key - Consumer key.
 * @param {string} credentials.secret - Consumer secret.
 * @returns {Promise<any>} A promise resolving to the Axios response containing the order data.
 * @throws Will throw an error if the request fails.
 */
export const getOrders = async (credentials: { url: string; key: string; secret: string }) => {
  const { url, key, secret } = credentials;

  try {
    const response = await axios.get(`${url}/orders`, {
      auth: {
        username: key,
        password: secret
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

/**
 * Updates the status of a specific WooCommerce order.
 *
 * @param {Object} credentials - WooCommerce API credentials and base URL.
 * @param {string} credentials.url - The base WooCommerce API URL.
 * @param {string} credentials.key - Consumer key.
 * @param {string} credentials.secret - Consumer secret.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} newStatus - The new WooCommerce status to set (e.g., "completed", "processing").
 * @returns {Promise<any>} A promise resolving to the updated order data.
 * @throws Will throw an error if the update fails.
 */
export const updateOrderStatus = async (
  credentials: { url: string; key: string; secret: string },
  orderId: number,
  newStatus: string
) => {
  const { url, key, secret } = credentials;

  try {
    const response = await axios.put(
      `${url}/orders/${orderId}`,
      { status: newStatus },
      {
        auth: {
          username: key,
          password: secret
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Clears saved WooCommerce API credentials from localStorage and reloads the page.
 *
 * This is used for "logging out" or resetting stored credentials.
 */
export const handleClearCredentials = () => {
  const confirm = window.confirm('This will remove your saved WooCommerce API URL, key, and secret. Continue?');

  if (confirm) {
    localStorage.removeItem('apiUrl');
    localStorage.removeItem('consumerKey');
    localStorage.removeItem('consumerSecret');
    console.log('Credentials cleared.');
    window.location.href = window.location.href;
  }
};
