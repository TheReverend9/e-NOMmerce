import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/ordercard';
import { getOrders } from '../../woocommerce';
;

export type StatusType = 'received' | 'ready' | 'delivering' | 'completed';

const App: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        const fetchedOrders = response.data || [];

        const today = new Date().toDateString();
        const todayOrders = fetchedOrders.filter((order: any) => {
          const createdDate = new Date(order.date_created).toDateString();
          return createdDate === today;
        });

        setOrders(todayOrders);

        const newStatuses: Record<number, StatusType> = {};
        todayOrders.forEach((order: any) => {
          if (!statuses[order.id]) {
            newStatuses[order.id] = 'received';
          } else {
            newStatuses[order.id] = statuses[order.id];
          }
        });

        setStatuses((prev) => ({ ...prev, ...newStatuses }));
      } catch (err) {
        console.error('Error fetching orders', err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id: number, newStatus: StatusType) => {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const activeOrders = orders.filter((order) => statuses[order.id] !== 'completed');
  const completedOrders = orders
    .filter((order) => statuses[order.id] === 'completed')
    .sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());

  const displayOrders = showCompleted ? completedOrders : activeOrders;

  return (
    <div style={{ backgroundColor: "#24022a" // Dark purple
      }}>
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

      {displayOrders.map((order) => (
        <div key={order.id} >
          <OrderCard order={order} status={statuses[order.id]} />
          {!showCompleted && (
            <div style={{ marginBottom: '30px', backgroundColor: "#24022a" }}>
              <button onClick={() => updateStatus(order.id, 'ready')}>Mark Ready</button>
              <button onClick={() => updateStatus(order.id, 'delivering')}>Mark Delivering</button>
              <button onClick={() => updateStatus(order.id, 'completed')}>Mark Completed</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
