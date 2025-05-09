import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { LeagueCard } from '@/components/LeagueCard';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { League, useLeagues } from '@/services/lolEsportsClient';

export default function HomeScreen() {
  const { leagues, loading, error } = useLeagues();
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
      
      <ThemedText>Top LoL Esports Leagues</ThemedText>
      
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
});
