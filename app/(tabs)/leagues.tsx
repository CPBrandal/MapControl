import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { LeagueCard } from '@/components/LeagueCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { League, useLeagues } from '@/services/lolEsportsClient';

export default function LeaguesScreen() {
  const { leagues, loading, error } = useLeagues();
  const colorScheme = useColorScheme() ?? 'light';

  const handleLeaguePress = (league: League) => {
    console.log(`League selected: ${league.name} (${league.id})`);
    // Future enhancement: navigate to league details
    // router.push(`/league/${league.id}`);
  };

  const renderLeague = ({ item }: { item: League }) => (
    <LeagueCard 
      league={item} 
      onPress={handleLeaguePress}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">LoL Esports Leagues</ThemedText>
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
      ) : (
        <FlatList
          data={leagues}
          renderItem={renderLeague}
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
});
