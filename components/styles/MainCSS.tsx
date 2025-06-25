// MainCSS.tsx
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingBottom: 16,
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
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  actionButtonText: {
    textAlign: 'center',
  },
});
