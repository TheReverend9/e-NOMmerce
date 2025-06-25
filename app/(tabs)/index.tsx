import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  fetchTodayOrders,
  mapWooStatusToAppStatus,
  StatusType,
  updateOrderStatus
} from '../../components/API/WoocommerceAPI'; // Adjust path
import OrderCard from '../../components/ordercard';
import { styles } from '../../components/styles/MainCSS';
import { Order } from '../../types';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prevCount, setPrevCount] = useState(0);

  const fetchSavedStatuses = async (): Promise<Record<number, StatusType>> => {
    try {
      const savedStatuses = await AsyncStorage.getItem('orderStatuses');
      return savedStatuses ? JSON.parse(savedStatuses) : {};
    } catch (error) {
      console.error('Failed to fetch saved statuses:', error);
      return {};
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const todayOrders = await fetchTodayOrders();

        if (todayOrders.length > prevCount) {
          // Optional: Sound notification
        }

        setPrevCount(todayOrders.length);
        setOrders(todayOrders);

        const savedStatuses = await fetchSavedStatuses();
        const updatedStatuses: Record<number, StatusType> = {};

        todayOrders.forEach((order) => {
          updatedStatuses[order.id] =
            savedStatuses[order.id] || mapWooStatusToAppStatus(order.status);
        });

        setStatuses(updatedStatuses);
      } catch (err) {
        console.error('Error fetching orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 120000);
    return () => clearInterval(interval);
  }, [prevCount]);

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

  const handleStatusUpdate = async (id: number, newStatus: StatusType) => {
    try {
      await updateOrderStatus(id, newStatus);
      setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    } catch (error) {
      console.error(`Failed to update status for order ${id}:`, error);
    }
  };

  const activeOrders = orders.filter(order => statuses[order.id] !== 'completed');
  const completedOrders = orders
    .filter(order => statuses[order.id] === 'completed')
    .sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());

  const displayOrders = showCompleted ? completedOrders : activeOrders;

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading orders...</Text>
      ) : (
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item: order }) => (
            <View style={styles.orderContainer}>
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
          )}
        />
      )}
    </View>
  );
};

export default App;
