import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusType } from '../app/(tabs)/index';
import { Order } from '../types';

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
    <View style={[styles.card, { backgroundColor: statusColors[status] }]}>
      <Text style={styles.header}>Order #{order.id}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Date:</Text> {new Date(order.date_created).toLocaleString()}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {fullName}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Phone:</Text> {order.billing.phone}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Email:</Text> {order.billing.email}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Address:</Text> {order.billing.address_1}</Text>

      <Text style={[styles.text, styles.sectionHeader]}>Items:</Text>
      <FlatList
        data={order.line_items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item.quantity} × {item.name} — ${item.total}{'\n'}
            <Text style={styles.itemDetail}><Text style={styles.bold}>ID:</Text> {item.product_id} &nbsp;</Text>
            <Text style={styles.itemDetail}><Text style={styles.bold}>Qty:</Text> {item.quantity} &nbsp;</Text>
            <Text style={styles.itemDetail}><Text style={styles.bold}>Name:</Text> {item.name}</Text>
          </Text>
        )}
      />

      <Text style={styles.text}><Text style={styles.bold}>Note:</Text> {order.customer_note || 'None'}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Total:</Text> ${order.total}</Text>
      <Text style={styles.text}><Text style={styles.bold}>Payment:</Text> {order.payment_method_title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  itemDetail: {
    color: 'white',
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },
});

export default OrderCard;
