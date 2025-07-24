import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import {
  fetchTodayOrders,
  mapWooStatusToAppStatus,
  StatusType
} from '../../components/API/WoocommerceAPI';
import OrderCard from '../../components/ordercard';
import { styles } from '../../components/styles/MainCSS';
import { Order } from '../../types';

/**
 * WooCommerce credentials object.
 * @typedef {Object} Credentials
 * @property {string} url - The base URL of the WooCommerce API.
 * @property {string} key - The consumer key.
 * @property {string} secret - The consumer secret.
 */
type Credentials = {
  url: string;
  key: string;
  secret: string;
};

/**
 * Completed component displays today's completed WooCommerce orders.
 *
 * @component
 */
const Completed: React.FC = () => {
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  /**
   * Retrieves order status overrides from AsyncStorage.
   *
   * @returns {Promise<Record<number, StatusType>>} A mapping of order IDs to app-specific statuses.
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

  /**
   * Loads stored WooCommerce credentials from localStorage on mount.
   */
  useEffect(() => {
    const loadCredentials = () => {
      const url = localStorage.getItem('apiUrl');
      const key = localStorage.getItem('consumerKey');
      const secret = localStorage.getItem('consumerSecret');

      if (url && key && secret) {
        setCredentials({ url, key, secret });
      } else {
        console.warn('Missing WooCommerce credentials.');
      }
    };

    loadCredentials();
  }, []);

  /**
   * Fetches and filters today's completed orders when credentials are present.
   * Runs once and on every credentials change.
   */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!credentials) return;

      setLoading(true);
      try {
        const todayOrders = await fetchTodayOrders(credentials); // Get today's orders
        const savedStatuses = await fetchSavedStatuses(); // Load previously saved statuses

        const updatedStatuses: Record<number, StatusType> = {};

        // Normalize each order's status
        todayOrders.forEach((order) => {
          updatedStatuses[order.id] =
            savedStatuses[order.id] || mapWooStatusToAppStatus(order.status);
        });

        setStatuses(updatedStatuses);

        // Filter only completed orders and sort oldest → newest
        const completedOnly = todayOrders
          .filter((order) => updatedStatuses[order.id] === 'completed')
          .sort(
            (a, b) =>
              new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
          );

        setCompletedOrders(completedOnly);
      } catch (err) {
        console.error('Error fetching completed orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (credentials) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 120000); // Refresh every 2 mins
      return () => clearInterval(interval);
    }
  }, [credentials]);

  return (
    <View style={styles.container}>
      {!credentials || loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <FlatList
          data={completedOrders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.scrollContainer}
          renderItem={({ item }) => (
            <View style={styles.orderContainer}>
              <OrderCard order={item} status={statuses[item.id]} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Completed;
