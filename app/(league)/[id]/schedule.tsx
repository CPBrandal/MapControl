import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { LeagueTabs } from '@/components/LeagueTabs';
import { MatchCard } from '@/components/MatchCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLeagueDetails, useLeagueSchedule } from '@/services/lolEsportsClient';
import { useState } from 'react';

export default function LeagueScheduleScreen() {
  const { id } = useLocalSearchParams();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const { league, loading: leagueLoading } = useLeagueDetails(id as string);
  const { schedule, loading, error, pagination } = useLeagueSchedule(id as string, pageToken);
  const colorScheme = useColorScheme() ?? 'light';

  // Group matches by date (YYYY-MM-DD)
  const groupedMatches = schedule.events?.reduce((groups: Record<string, any[]>, match: any) => {
    const date = new Date(match.startTime).toISOString().split('T')[0];
    groups[date] = groups[date] || [];
    groups[date].push(match);
    return groups;
  }, {}) || {};

  const sortedDates = Object.keys(groupedMatches).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleMatchPress = (matchId: string) => {
    // TODO: Navigate to match details when implemented
    console.log(`Match pressed: ${matchId}`);
  };

  const renderSection = ({ item: date }: { item: string }) => {
    // Format date for display
    const displayDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });

    const matches = groupedMatches[date];

    return (
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionHeader}>{displayDate}</ThemedText>
        {matches.map((match: any) => (
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
      <ThemedView style={styles.header}>
        <ThemedText type="title">{league?.name || 'League'}</ThemedText>
        {league?.region && <ThemedText>{league.region}</ThemedText>}
      </ThemedView>
      
      <LeagueTabs leagueId={id as string} activeTab="schedule" />

      {loading || leagueLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme].tint}
          style={styles.loader}
        />
      ) : error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error.message}</ThemedText>
        </ThemedView>
      ) : schedule.events?.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No matches scheduled for this league</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.content}>
          <FlatList
            data={sortedDates}
            renderItem={renderSection}
            keyExtractor={item => item}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              pagination?.older ? (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => setPageToken(pagination.older)}
                >
                  <ThemedText style={styles.paginationButtonText}>Load Earlier Matches</ThemedText>
                </TouchableOpacity>
              ) : null
            }
            ListHeaderComponent={
              pagination?.newer ? (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => setPageToken(pagination.newer)}
                >
                  <ThemedText style={styles.paginationButtonText}>Load Newer Matches</ThemedText>
                </TouchableOpacity>
              ) : null
            }
          />
        </ThemedView>
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
  content: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paginationButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});