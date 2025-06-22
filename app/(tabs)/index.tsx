import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  // Maps app status to WooCommerce status
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

  // Maps WooCommerce status to app status
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

  // Fetches saved statuses from AsyncStorage
  const fetchSavedStatuses = async (): Promise<Record<number, StatusType>> => {
    try {
      const savedStatuses = await AsyncStorage.getItem('orderStatuses');
      return savedStatuses ? JSON.parse(savedStatuses) : {};
    } catch (error) {
      console.error('Failed to fetch saved statuses:', error);
      return {};
    }
  };

  // Fetches orders and updates statuses
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrders();
        const fetchedOrders: Order[] = response.data || [];
        const today = new Date().toDateString();
        const todayOrders = fetchedOrders.filter(
          (order) => new Date(order.date_created).toDateString() === today
        );

        if (todayOrders.length > prevCount) {
          // Handle sound notification for new orders
        }
        setPrevCount(todayOrders.length);
        setOrders(todayOrders);

        const savedStatuses = await fetchSavedStatuses();
        const updatedStatuses: Record<number, StatusType> = {};

        todayOrders.forEach((order) => {
          updatedStatuses[order.id] = savedStatuses[order.id] || mapWooStatusToAppStatus(order.status);
        });

        setStatuses(updatedStatuses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders', err);
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 120000);
    return () => clearInterval(interval);
  }, [prevCount]);

  // Saves updated statuses to AsyncStorage
  useEffect(() => {
    const saveStatuses = async () => {
      try {
        await AsyncStorage.setItem('orderStatuses', JSON.stringify(statuses));
      } catch (error) {
        console.error('Failed to save statuses:', error);
      }
    };
    saveStatuses();
  }, [statuses]);

  // Handles status update for an order
  const handleStatusUpdate = async (id: number, newStatus: StatusType) => {
    try {
      const wcStatus = mapStatusToWooCommerce(newStatus);
      await updateOrderStatus(id, wcStatus);
      setStatuses((prev) => ({ ...prev, [id]: newStatus }));
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
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome to:
        {'\n'}
        <Text style={styles.subHeader}>E-NOMMERCE</Text>
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCompleted(!showCompleted)}
      >
        <Text style={styles.buttonText}>
          {showCompleted ? 'Show Active Orders' : 'Show Completed Orders'}
        </Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Loading orders...</Text>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {displayOrders.map((order) => (
            <View key={order.id} style={styles.orderContainer}>
              <OrderCard order={order} status={statuses[order.id]} />
              {!showCompleted && (
                <View style={styles.actionContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleStatusUpdate(order.id, 'ready')}
                  >
                    <Text style={styles.actionButtonText}>Mark Ready</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleStatusUpdate(order.id, 'delivering')}
                  >
                    <Text style={styles.actionButtonText}>Mark Delivering</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleStatusUpdate(order.id, 'completed')}
                  >
                    <Text style={styles.actionButtonText}>Mark Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24022a',
    padding: 16,
  },
  header: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'Great Vibes',
    textAlign: 'center',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  scrollContainer: {
    maxHeight: '70%',
  },
  orderContainer: {
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 8,
  },
  actionButtonText: {
    textAlign: 'center',
  },
});

export default App;
