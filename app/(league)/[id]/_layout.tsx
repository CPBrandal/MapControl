import { useLeagueDetails } from '@/services/lolEsportsClient';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function LeagueLayout() {
  const { id: leagueId } = useLocalSearchParams();
  const { league } = useLeagueDetails(leagueId as string);

  return (
    <Stack>
      <Stack.Screen 
        name="teams" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="team/[teamId]" 
        options={{ 
          headerShown: true,
          headerTitle: 'Team Details',
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}