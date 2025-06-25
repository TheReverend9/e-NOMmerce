import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import {
  fetchTodayOrders,
  mapWooStatusToAppStatus,
  StatusType
} from '../../components/API/WoocommerceAPI'; // Adjust path as needed
import OrderCard from '../../components/ordercard';
import { styles } from '../../components/styles/MainCSS';
import { Order } from '../../types';

const Completed: React.FC = () => {
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, StatusType>>({});
  const [loading, setLoading] = useState(true);

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
        const savedStatuses = await fetchSavedStatuses();
        const updatedStatuses: Record<number, StatusType> = {};

        todayOrders.forEach((order) => {
          updatedStatuses[order.id] =
            savedStatuses[order.id] || mapWooStatusToAppStatus(order.status);
        });

        setStatuses(updatedStatuses);

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

    fetchOrders();
    const interval = setInterval(fetchOrders, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading completed orders...</Text>
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
