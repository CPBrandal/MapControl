import { Stack } from 'expo-router';

export default function TeamScheduleLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[teamId]" 
        options={{ 
          headerTitle: 'Team Schedule',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}