import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/ordercard';
import { Order } from '../../types';
import { getOrders, updateOrderStatus } from '../../woocommerce';
export type StatusType = 'received' | 'ready' | 'delivering' | 'completed';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
  localStorage.setItem('orderStatuses', JSON.stringify(statuses));
}, [statuses]);

  const mapStatusToWooCommerce = (status: StatusType): string => {
    switch (status) {
      case 'received':
        return 'processing';
      case 'ready':
        return 'on-hold';
      case 'delivering':
        return 'pending';
      case 'completed':
        return 'completed';
      default:
        return 'processing';
    }
  };

  const mapWooStatusToAppStatus = (wcStatus: string): StatusType => {
  switch (wcStatus) {
    case 'processing':
      return 'received';
    case 'on-hold':
      return 'ready';
    case 'pending':
      return 'delivering';
    case 'completed':
      return 'completed';
    default:
      return 'received';
  }
};


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        const fetchedOrders: Order[] = response.data || [];
        setLoading(true);
        const today = new Date().toDateString();
        const todayOrders = fetchedOrders.filter(order => 
          new Date(order.date_created).toDateString() === today
        );  
        // Play sound if new order(s) added
      if (todayOrders.length > prevCount) {
        const audio = new Audio('/notification-sound.mp3'); // put a notification mp3 file in public folder
        audio.play();
      }
      setPrevCount(todayOrders.length);  
        setOrders(todayOrders);
        setLoading(false);

        setStatuses(() => {
          const savedStatuses = localStorage.getItem('orderStatuses');
          const parsed = savedStatuses ? JSON.parse(savedStatuses) as Record<number, StatusType> : {};
          const updatedStatuses: Record<number, StatusType> = {};

            todayOrders.forEach(order => {
              updatedStatuses[order.id] = parsed[order.id] || mapWooStatusToAppStatus(order.status);
          });

          return updatedStatuses;
        });
        
          setLoading(false);
      } catch (err) {
        console.error('Error fetching orders', err);
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [prevCount]);

  const handleStatusUpdate = async (id: number, newStatus: StatusType) => {
  try {
    const wcStatus = mapStatusToWooCommerce(newStatus);
    await updateOrderStatus(id, wcStatus);
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
  } catch (error) {
    console.error(`Failed to update status for order ${id}:`, error);
  }
};

  const activeOrders = orders.filter((order) => statuses[order.id] !== 'completed');
  const completedOrders = orders
    .filter((order) => statuses[order.id] === 'completed')
    .sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());

  const displayOrders = showCompleted ? completedOrders : activeOrders;

  return (
    <div style={{ backgroundColor: "#24022a", // Dark purple
      minHeight: "100vh", padding: "2rem"}}>
      <h1 style={{ color: 'white', fontSize: '5rem', marginLeft: '15rem', marginBottom: '1rem' }}>
      <span style={{ fontFamily: 'Great Vibes', fontStyle: 'italic' }}>
        Welcome to:&nbsp;
        <br></br>
      </span>
      <span style={{ fontSize: '3rem', fontWeight: 'bold', marginLeft: '20rem' }}>
        E-NOMMERCE
      </span>
    </h1>
      <button onClick={() => setShowCompleted(!showCompleted)} style={{ marginBottom: '20px',  }}>
        {showCompleted ? 'Show Active Orders' : 'Show Completed Orders'}
      </button>
      {loading ? (
        <div style={{ color: 'white', fontSize: '2rem', textAlign: 'center' }}>Loading orders...</div>
        ) : 
        /* Scroll Bar */
          <div
  style={{
    maxHeight: '70vh', 
    overflowY: 'auto',
    paddingRight: '1rem',
    marginRight: '1rem',
  }}
>
      {displayOrders.map((order) => (
        <div key={order.id} >
          <OrderCard order={order} status={statuses[order.id]} />
          {!showCompleted && (
            <div style={{ marginBottom: '30px' }}>
              <button style={{ marginRight: '10px'}} onClick={() => handleStatusUpdate(order.id, 'ready')}>Mark Ready</button>
              <button style={{ marginRight: '10px' }} onClick={() => handleStatusUpdate(order.id, 'delivering')}>Mark Delivering</button>
              <button style={{ marginRight: '10px' }} onClick={() => handleStatusUpdate(order.id, 'completed')}>Mark Completed</button>
            </div>
          )}
        </div>
      ))}
    </div>
}
</div>
  )}
export default App;
