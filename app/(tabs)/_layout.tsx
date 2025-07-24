import { Tabs } from 'expo-router';
import { Platform, Text, TouchableOpacity } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { handleClearCredentials } from '../../woocommerce';

/**
 * The main tab layout component used for navigation.
 * 
 * Includes tabs for:
 * - Home (`index`)
 * - Completed Orders (`completed_orders`)
 *
 * Provides a header button to clear stored WooCommerce credentials.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function TabLayout() {
  const colorScheme = useColorScheme(); // Detect user's theme preference (light/dark)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, // Color of active tab icon
        tabBarButton: HapticTab, // Custom tab button with haptics
        tabBarBackground: TabBarBackground, // Custom background component
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Enables blur effects on iOS
          },
          default: {},
        }),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Orders',
          headerShown: true,
          headerTitle: 'e-NOMmerce',
          
          // Button in top-right corner of the header to clear stored credentials
          headerRight: () => (
            <TouchableOpacity onPress={handleClearCredentials} style={{ marginRight: 10 }}>
              <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontWeight: '600' }}>
                Clear API Credentials
              </Text>
            </TouchableOpacity>
          ),

          // Icon shown in the tab bar for this screen
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Completed Orders Tab */}
      <Tabs.Screen
        name="completed_orders"
        options={{
          title: 'Completed Orders',
          headerShown: true,
          headerTitle: 'Your Completed Orders',

          // Icon shown in the tab bar for this screen
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
