// Updated: July 7, 2025

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
} from '../../components/API/WoocommerceAPI';
import OrderCard from '../../components/ordercard';
import { styles } from '../../components/styles/MainCSS';
import SecureInputModal from '../../components/ui/SecureInputModal';
import { Order } from '../../types';

/**
 * Structure for WooCommerce API credentials
 */
type Credentials = {
  url: string;
  key: string;
  secret: string;
};

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [showCompleted, setShowCompleted] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Loads order statuses from AsyncStorage (persisted local device storage)
   */
  const fetchSavedStatuses = async (): Promise<Record<number, StatusType>> => {
    try {
      const savedStatuses = await AsyncStorage.getItem('orderStatuses');
      return savedStatuses ? JSON.parse(savedStatuses) : {};
    } catch (error) {
      console.error('Failed to fetch saved statuses:', error);
      return {};
    }
  };

  // Load credentials from localStorage when component mounts
  useEffect(() => {
    const loadStored = () => {
      const url = localStorage.getItem('apiUrl');
      const key = localStorage.getItem('consumerKey');
      const secret = localStorage.getItem('consumerSecret');

      if (url && key && secret) {
        setCredentials({ url, key, secret });
      } else {
        setModalVisible(true); // Prompt user to enter credentials
      }

      setLoading(false);
    };
    loadStored();
  }, []);

  // Fetch and process today's orders when credentials change
  useEffect(() => {
    const fetchOrders = async () => {
      if (!credentials) return;

      setLoading(true);
      try {
        const todayOrders = await fetchTodayOrders(credentials);

        if (todayOrders.length > prevCount) {
          // You could trigger a notification here if new orders are detected
        }

        setPrevCount(todayOrders.length);
        setOrders(todayOrders);

        const savedStatuses = await fetchSavedStatuses();
        const updatedStatuses: Record<number, StatusType> = {};

        // Merge WooCommerce status with locally saved statuses
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
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [credentials, prevCount]);

  // Save status changes to AsyncStorage whenever they change
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

  /**
   * Updates status for a specific order
   *
   * @param id - WooCommerce order ID
   * @param newStatus - New app-specific status to apply
   */
  const handleStatusUpdate = async (id: number, newStatus: StatusType) => {
    if (!credentials) return;

    try {
      await updateOrderStatus(credentials, id, newStatus);
      setStatuses((prev) => ({ ...prev, [id]: newStatus }));
    } catch (error) {
      console.error(`Failed to update status for order ${id}:`, error);
    }
  };

  // Orders that are not completed
  const activeOrders = orders.filter(order => statuses[order.id] !== 'completed');

  // Orders that are marked completed (sorted oldest to newest)
  const completedOrders = orders
    .filter(order => statuses[order.id] === 'completed')
    .sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());

  // Toggle between active or completed orders based on `showCompleted`
  const displayOrders = showCompleted ? completedOrders : activeOrders;

  return (
    <View style={styles.container}>
      {!credentials ? (
        // If no credentials, show loading spinner
        <ActivityIndicator style={{ flex: 1 }} size="large" color="gray" />
      ) : loading ? (
        // Show loading message while fetching orders
        <Text style={styles.loadingText}>Loading orders...</Text>
      ) : (
        // Render order list
        <FlatList
          data={displayOrders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item: order }) => (
            <View style={styles.orderContainer}>
              <OrderCard order={order} status={statuses[order.id]} />
              {!showCompleted && (
                <View style={styles.actionContainer}>
                  {['ready', 'delivering', 'completed'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={styles.actionButton}
                      onPress={() => handleStatusUpdate(order.id, status as StatusType)}
                    >
                      <Text style={styles.actionButtonText}>
                        Mark {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Modal to enter WooCommerce API credentials */}
      <SecureInputModal
        visible={modalVisible}
        onSubmit={(url, key, secret) => {
          setCredentials({ url, key, secret });
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default App;
