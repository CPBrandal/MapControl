import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { MatchCard } from '@/components/MatchCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTeamDetails, useTeamSchedule } from '@/services/lolEsportsClient';

export default function TeamScheduleScreen() {
  const { teamId } = useLocalSearchParams();
  const { team, loading: teamLoading } = useTeamDetails(teamId as string);
  const { schedule, loading: scheduleLoading, error } = useTeamSchedule(teamId as string);
  const colorScheme = useColorScheme() ?? 'light';
  
  const loading = teamLoading || scheduleLoading;

  // Sort matches
  const sortedMatches = [...(schedule.events || [])].sort((a, b) => {
    // First, separate by state
    if (a.state === 'inProgress' && b.state !== 'inProgress') return -1;
    if (b.state === 'inProgress' && a.state !== 'inProgress') return 1;
    
    if (a.state === 'unstarted' && b.state === 'completed') return -1;
    if (a.state === 'completed' && b.state === 'unstarted') return 1;
    
    // Then sort by date (newest first for completed, soonest first for upcoming)
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    
    if (a.state === 'completed' && b.state === 'completed') {
      return dateB - dateA; // Most recent completed matches first
    }
    
    return dateA - dateB; // Soonest upcoming matches first
  });

  // Group matches by state for display
  const liveMatches = sortedMatches.filter(match => match.state === 'inProgress');
  const upcomingMatches = sortedMatches.filter(match => match.state === 'unstarted');
  const completedMatches = sortedMatches.filter(match => match.state === 'completed');

  const handleMatchPress = (matchId: string) => {
    // TODO: Navigate to match details when implemented
    console.log(`Match pressed: ${matchId}`);
  };

  const renderMatchSection = (title: string, matchList: any[]) => {
    if (matchList.length === 0) return null;
    
    return (
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
        {matchList.map(match => (
          <MatchCard
            key={match.match.id}
            id={match.match.id}
            teams={match.match.teams}
            startTime={match.startTime}
            state={match.state}
            blockName={match.blockName}
            strategy={match.match.strategy}
            onPress={handleMatchPress}
          />
        ))}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
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
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <ThemedView>
              <ThemedView style={styles.header}>
                <ThemedText type="title">{team?.name || 'Team Schedule'}</ThemedText>
                {team?.homeLeague?.region && (
                  <ThemedText style={styles.regionText}>{team.homeLeague.region}</ThemedText>
                )}
              </ThemedView>
              
              {sortedMatches.length === 0 ? (
                <ThemedView style={styles.emptyContainer}>
                  <ThemedText>No matches found for this team</ThemedText>
                </ThemedView>
              ) : (
                <>
                  {renderMatchSection('LIVE', liveMatches)}
                  {renderMatchSection('UPCOMING', upcomingMatches)}
                  {renderMatchSection('COMPLETED', completedMatches)}
                </>
              )}
            </ThemedView>
          )}
          data={[]} // We're using ListHeaderComponent for the content
          renderItem={({ item }) => null}
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
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  regionText: {
    marginTop: 4,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 8,
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
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginTop: 20,
  },
});