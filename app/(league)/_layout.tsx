// app/(league)/_layout.tsx
import { Stack } from 'expo-router';

export default function LeagueRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Only define the [id] route at the root level */}
      {/* The nested routes will be handled by [id]/_layout.tsx */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}