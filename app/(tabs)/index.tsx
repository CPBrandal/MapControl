// app/(tabs)/index.tsx - update the code that uses the liveMatches
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { LeagueCard } from '@/components/LeagueCard';
import { LiveMatchCard } from '@/components/LiveMatchCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { League, LiveEvent, useLeagues, useLiveMatches } from '@/services/lolEsportsClient';

export default function HomeScreen() {
  const { leagues, loading: leaguesLoading, error: leaguesError } = useLeagues();
  const { liveMatches, loading: liveLoading, refreshing: liveRefreshing, error: liveError } = useLiveMatches();
  const colorScheme = useColorScheme() ?? 'light';

  // Get only the top 5 leagues (already sorted by the hook)
  const topLeagues = leagues.slice(0, 5); 

  const handleLeaguePress = (league: League) => {
    router.push(`/(league)/${league.id}/teams` as any);
  };

  const renderLeague = ({ item }: { item: League }) => (
    <LeagueCard
      league={item}
      onPress={handleLeaguePress}
      compact={true}
    />
  );
  
  const renderLiveMatch = ({ item }: { item: LiveEvent }) => (
    <LiveMatchCard match={item} />
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">LoL Esports</ThemedText>
      </ThemedView>
      
      {/* Live Matches Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Live Matches</ThemedText>
          
          {/* Small refresh indicator */}
          {liveRefreshing && (
            <ActivityIndicator
              size="small"
              color={Colors[colorScheme].tint}
              style={styles.refreshIndicator}
            />
          )}
        </ThemedView>
        
        {liveLoading ? (
          <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme].tint} 
            style={styles.loader} 
          />
        ) : liveError ? (
          <ThemedText style={styles.errorText}>
            Unable to load live matches
          </ThemedText>
        ) : liveMatches.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText>No matches currently live</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={liveMatches}
            renderItem={renderLiveMatch}
            keyExtractor={item => item.id}
            scrollEnabled={false} // Disable scrolling since we're in a ParallaxScrollView
          />
        )}
      </ThemedView>
      
      {/* Top Leagues Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Top Leagues</ThemedText>
        </ThemedView>
        
        {leaguesLoading ? (
          <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme].tint} 
            style={styles.loader} 
          />
        ) : leaguesError ? (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{leaguesError.message}</ThemedText>
          </ThemedView>
        ) : (
          <>
            <FlatList
              data={topLeagues}
              renderItem={renderLeague}
              keyExtractor={item => item.id}
              scrollEnabled={false} // Disable scrolling since we're in a ParallaxScrollView
            />
            
            <ThemedText style={styles.viewAllText}>
              View all leagues in the Leagues tab
            </ThemedText>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Updated styles to include the refreshIndicator
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshIndicator: {
    marginLeft: 10,
  },
  loader: {
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  viewAllText: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
});