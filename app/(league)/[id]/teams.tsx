import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { TeamCard } from '@/components/TeamCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Team, useLeagueDetails, useTeamsByLeague } from '@/services/lolEsportsClient';
import { router } from 'expo-router';

export default function TeamsScreen() {
  const { id: leagueId } = useLocalSearchParams();
  const { teams, loading: teamsLoading, error: teamsError } = useTeamsByLeague(leagueId as string);
  const { league, loading: leagueLoading, error: leagueError } = useLeagueDetails(leagueId as string);
  const colorScheme = useColorScheme() ?? 'light';
  
  const loading = teamsLoading || leagueLoading;
  const error = teamsError || leagueError;

  const handleTeamPress = (team: Team) => {
    router.push(`/(league)/${leagueId}/team/${team.id}` as any);
};

  const renderTeam = ({ item }: { item: Team }) => (
    <TeamCard 
      team={item} 
      onPress={handleTeamPress}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{league?.name || 'League'} Teams</ThemedText>
        {league?.region && <ThemedText>{league.region}</ThemedText>}
      </ThemedView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme].tint}
          style={styles.loader}
        />
      ) : error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error.message}</ThemedText>
        </ThemedView>
      ) : teams.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No teams found for this league</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={teams}
          renderItem={renderTeam}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});