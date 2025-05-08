import { Platform } from 'react-native';

// Helper function to determine the appropriate base URL for local development
const getDevelopmentApiUrl = () => {
  // For iOS simulator, use localhost
  if (Platform.OS === 'ios') {
    return 'http://localhost:3000';
  } 
  // For Android emulator
  else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000'; // Special IP to access host from Android emulator
  } 
  // For web
  else {
    return 'http://localhost:3000';
  }
};

// Configuration for the application
const config = {
  development: {
    apiBaseUrl: getDevelopmentApiUrl(),
  },
  production: {
    apiBaseUrl: 'http://your-production-api-url.com', // Replace with actual production URL if/when you deploy
  },
};

// Determine which environment we're in
const isDevelopment = __DEV__;
const environment = isDevelopment ? 'development' : 'production';

console.log(`Using API URL: ${config[environment].apiBaseUrl}`);

// Export the configuration for the current environment
export default config[environment];