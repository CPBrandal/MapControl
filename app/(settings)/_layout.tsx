import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="profile" 
        options={{ 
          headerTitle: 'Profile',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="mapcontrol-plus" 
        options={{ 
          headerTitle: 'MapControl+',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ 
          headerTitle: 'Notifications',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="more" 
        options={{ 
          headerTitle: 'More',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}