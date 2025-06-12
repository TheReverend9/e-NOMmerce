import React from 'react';
import { StatusType } from '../app/(tabs)/index';
import { Order } from '../types';
import './OrderCardStyle.css';

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
  const lineItems = order.line_items.map(item => `${item.quantity} × ${item.name}`).join(', ');
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
                {item.quantity} × {item.name} — ${item.total} <br />
                <strong>ID:</strong> {item.product_id} &nbsp;
                <strong>Qty:</strong> {item.quantity} &nbsp;
                <strong>Name:</strong> {item.name}
              </li>
            ))}
          </ul>
       
      <p><strong>Note:</strong> {order.customer_note || 'None'}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Payment:</strong> {order.payment_method_title}</p>
   
 </div>
  )}
export default OrderCard;