import React from 'react';
import { StatusType } from '../app/(tabs)/index';

interface LineItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
}

interface BillingInfo {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address_1: string;
}

interface Order {
  id: number;
  date_created: string;
  billing: BillingInfo;
  line_items: LineItem[];
  customer_note?: string;
  total: string;
  payment_method_title: string;
}

interface OrderCardProps {
  order: Order;
  status: StatusType;
}

const statusColors: Record<StatusType, string> = {
  received: '#333',
  ready: 'green',
  delivering: 'orange',
  completed: 'red',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, status }) => {
  const fullName = `${order.billing.first_name} ${order.billing.last_name}`;

  return (
    <div
      className="order-card"
      style={{
        backgroundColor: statusColors[status],
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '10px',
        color: 'white',
      }}
    >
      <h2>Order #{order.id}</h2>
      <p><strong>Date:</strong> {new Date(order.date_created).toLocaleString()}</p>
      <p><strong>Name:</strong> {fullName}</p>
      <p><strong>Phone:</strong> {order.billing.phone}</p>
      <p><strong>Email:</strong> {order.billing.email}</p>
      <p><strong>Address:</strong> {order.billing.address_1}</p>

      <h3>Items:</h3>
      <ul>
        {order.line_items.map((item) => (
          <li key={item.id}>
            <strong>ID:</strong> {item.product_id}&nbsp;
            <strong>Name:</strong> {item.name}&nbsp;
            <strong>Qty:</strong> {item.quantity}
          </li>
        ))}
      </ul>

      <p><strong>Note:</strong> {order.customer_note || 'None'}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Payment:</strong> {order.payment_method_title}</p>
    </div>
  );
};

export default OrderCard;
