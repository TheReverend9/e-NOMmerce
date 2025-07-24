import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  visible: boolean;
  onSubmit: (url: string, key: string, secret: string) => void;
};

/**
 * Modal component for entering WooCommerce API credentials.
 * Includes fields for URL, key, and secret, with optional localStorage persistence.
 *
 * @component
 * @param {boolean} visible - Whether the modal is currently shown
 * @param {(url: string, key: string, secret: string) => void} onSubmit - Callback with entered credentials
 */
export default function SecureInputModal({ visible, onSubmit }: Props) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [secret, setSecret] = useState('');
  const [remember, setRemember] = useState(false);

  /**
   * Handle saving credentials.
   * If "Remember" is checked, credentials are saved to localStorage.
   * Then the credentials are submitted via the onSubmit prop.
   */
  const handleSave = () => {
    if (remember) {
      localStorage.setItem('apiUrl', url);
      localStorage.setItem('consumerKey', key);
      localStorage.setItem('consumerSecret', secret);
    }
    onSubmit(url, key, secret);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🔐 Enter WooCommerce Credentials</Text>

          {/* API URL input */}
          <TextInput
            placeholder="API URL (e.g. https://your-website.com/wp-json/wc/v3)"
            value={url}
            onChangeText={setUrl}
            style={styles.input}
            autoCapitalize="none"
          />

          {/* Consumer Key input */}
          <TextInput
            placeholder="Consumer Key"
            value={key}
            onChangeText={setKey}
            style={styles.input}
            autoCapitalize="none"
          />

          {/* Consumer Secret input (masked) */}
          <TextInput
            placeholder="Consumer Secret"
            value={secret}
            onChangeText={setSecret}
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
          />

          {/* Remember credentials option with warning */}
          <View style={styles.checkboxRow}>
            <Checkbox
              value={remember}
              onValueChange={setRemember}
              color={remember ? '#4630eb' : undefined}
            />
            <View style={styles.checkboxText}>
              <Text style={styles.label}>Remember these credentials on this device</Text>
              <Text style={styles.warning}>
                Convenient, but ⚠️ stored unencrypted in your browser and accessible to others using this device.
              </Text>
              <Text style={styles.warning}>
                However, at the top right of the screen is a "Clear API Credentials" button that will remove your credentials.
              </Text>
            </View>
          </View>

          {/* Submit button */}
          <Button title="Continue" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088', // semi-transparent black overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    elevation: 5, // adds shadow on Android
  },
  title: {
    fontSize: 18,
    marginBottom: 14,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingVertical: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontWeight: '600',
  },
  warning: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});
