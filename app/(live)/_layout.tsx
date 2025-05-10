import { Stack } from 'expo-router';

export default function LiveMatchLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[gameId]" 
        options={{ 
          headerTitle: 'Live Match Details',
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}