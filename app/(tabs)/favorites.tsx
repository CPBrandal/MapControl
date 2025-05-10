import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { TeamCard } from '@/components/TeamCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Team } from '@/services/lolEsportsClient';

export default function FavoritesScreen() {
  const { favoriteTeams, loadingFavorites } = useFavorites();

  const handleTeamPress = (team: Team) => {
    // Navigate to team schedule screen
    router.push(`/(team-schedule)/${team.id}` as any);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Favorites</ThemedText>
      </ThemedView>
      
      {favoriteTeams.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText>You don't have any favorites yet.</ThemedText>
          <ThemedText>Visit the Leagues tab to add favorites.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={favoriteTeams}
          renderItem={({ item }) => (
            <TeamCard 
              team={item}
              onPress={handleTeamPress}
            />
          )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});