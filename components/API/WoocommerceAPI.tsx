// WoocommerceAPI.tsx
import { Order } from '../../types'; // adjust path
import { getOrders, updateOrderStatus as wcUpdateOrderStatus } from '../../woocommerce';

export type StatusType = 'received' | 'ready' | 'delivering' | 'completed';

export const mapStatusToWooCommerce = (status: StatusType): string => {
  switch (status) {
    case 'received': return 'processing';
    case 'ready': return 'on-hold';
    case 'delivering': return 'pending';
    case 'completed': return 'completed';
    default: return 'processing';
  }
};

export const mapWooStatusToAppStatus = (wcStatus: string): StatusType => {
  switch (wcStatus) {
    case 'processing': return 'received';
    case 'on-hold': return 'ready';
    case 'pending': return 'delivering';
    case 'completed': return 'completed';
    default: return 'received';
  }
};

export const fetchTodayOrders = async (): Promise<Order[]> => {
  const response = await getOrders();
  const allOrders: Order[] = response.data || [];
  const today = new Date().toISOString().split('T')[0];

  return allOrders.filter((order) => {
    const orderDate = new Date(order.date_created).toISOString().split('T')[0];
    return orderDate === today;
  });
};

export const updateOrderStatus = async (id: number, status: StatusType) => {
  const wcStatus = mapStatusToWooCommerce(status);
  return wcUpdateOrderStatus(id, wcStatus);
};
