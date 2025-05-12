// app/(league)/[id]/_layout.tsx
import { Stack } from 'expo-router';

export default function LeagueIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { 
          backgroundColor: 'transparent',
        },
      }}
    >
      {/* Define base index route for the unified view */}
      <Stack.Screen name="index" />

      {/* Redirect routes (legacy support) */}
      <Stack.Screen name="schedule" options={{ animation: 'none' }} />
      <Stack.Screen name="teams" options={{ animation: 'none' }} />
      <Stack.Screen name="standings" options={{ animation: 'none' }} />
      
      {/* Define modals at this level only */}
      <Stack.Screen 
        name="team/[teamId]" 
        options={{ 
          headerShown: true,
          headerTitle: 'Team Details',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
      <Stack.Screen 
        name="player/[playerId]" 
        options={{ 
          headerShown: true,
          headerTitle: 'Player Details',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
    </Stack>
  );
}