import { Order } from '../../types';
import { getOrders, updateOrderStatus as wcUpdateOrderStatus } from '../../woocommerce';

/**
 * Possible internal status types used in the app.
 */
export type StatusType = 'received' | 'ready' | 'delivering' | 'completed';

/**
 * Maps app-specific order status to WooCommerce order status.
 *
 * @param {StatusType} status - App-defined status
 * @returns {string} Corresponding WooCommerce status string
 */
export const mapStatusToWooCommerce = (status: StatusType): string => {
  switch (status) {
    case 'received': return 'processing';
    case 'ready': return 'on-hold';
    case 'delivering': return 'pending';
    case 'completed': return 'completed';
    default: return 'processing';
  }
};

/**
 * Maps WooCommerce order status to app-specific status.
 *
 * @param {string} wcStatus - WooCommerce status string
 * @returns {StatusType} Corresponding app-defined status
 */
export const mapWooStatusToAppStatus = (wcStatus: string): StatusType => {
  switch (wcStatus) {
    case 'processing': return 'received';
    case 'on-hold': return 'ready';
    case 'pending': return 'delivering';
    case 'completed': return 'completed';
    default: return 'received';
  }
};

/**
 * Fetches all WooCommerce orders created today.
 *
 * @param {{ url: string, key: string, secret: string }} credentials - API access info
 * @returns {Promise<Order[]>} A list of today's orders
 */
export const fetchTodayOrders = async (
  credentials: { url: string; key: string; secret: string }
): Promise<Order[]> => {
  const response = await getOrders(credentials);
  const allOrders: Order[] = response.data || [];

  // Get today's date string in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split('T')[0];

  // Filter orders that were created today
  return allOrders.filter(order => {
    const orderDate = new Date(order.date_created).toISOString().split('T')[0];
    return orderDate === today;
  });
};

/**
 * Updates the WooCommerce status of a given order.
 *
 * @param {{ url: string, key: string, secret: string }} credentials - API access info
 * @param {number} id - The ID of the order to update
 * @param {StatusType} status - New status to apply (app-specific)
 * @returns {Promise<any>} WooCommerce API response
 */
export const updateOrderStatus = async (
  credentials: { url: string; key: string; secret: string },
  id: number,
  status: StatusType
) => {
  // Convert app status to WooCommerce-compatible status
  const wcStatus = mapStatusToWooCommerce(status);
  return wcUpdateOrderStatus(credentials, id, wcStatus);
};
