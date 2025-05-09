import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { PlayerCard } from '@/components/PlayerCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Player, useTeamDetails } from '@/services/lolEsportsClient';

export default function TeamDetailsScreen() {
  const { teamId } = useLocalSearchParams();
  const { team, loading, error } = useTeamDetails(teamId as string);
  const colorScheme = useColorScheme() ?? 'light';

  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerCard player={item} />
  );

  // Group players by role
  const playersByRole = team?.players.reduce((groups, player) => {
    const role = player.role || 'Unknown';
    groups[role] = groups[role] || [];
    groups[role].push(player);
    return groups;
  }, {} as Record<string, Player[]>);

  // Create array of roles to render in the correct order
  const roleOrder = ['top', 'jungle', 'mid', 'bottom', 'support', 'none', 'Unknown'];
  
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
      ) : team ? (
        <>
          <ThemedView style={styles.header}>
            <ThemedView style={styles.teamInfo}>
              {team.image && (
                <Image
                  source={{ uri: team.image }}
                  style={styles.teamLogo}
                  contentFit="contain"
                />
              )}
              <ThemedView style={styles.teamNameContainer}>
                <ThemedText type="title">{team.name}</ThemedText>
                {team.homeLeague && (
                  <ThemedText>{team.homeLeague.region}</ThemedText>
                )}
                <ThemedText style={styles.teamCode}>{team.code}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          
          <ThemedText type="subtitle" style={styles.playersTitle}>
            Players
          </ThemedText>
          
          {team.players.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>No players available for this team</ThemedText>
            </ThemedView>
          ) : (
            <FlatList
              data={team.players}
              renderItem={renderPlayer}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={() => (
                <ThemedView style={styles.rosterInfo}>
                  <ThemedText style={styles.rosterCount}>
                    Roster size: {team.players.length} players
                  </ThemedText>
                </ThemedView>
              )}
            />
          )}
        </>
      ) : (
        <ThemedView style={styles.errorContainer}>
          <ThemedText>Team not found</ThemedText>
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
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  teamNameContainer: {
    flex: 1,
  },
  teamCode: {
    marginTop: 5,
    opacity: 0.6,
  },
  playersTitle: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rosterInfo: {
    marginBottom: 16,
  },
  rosterCount: {
    fontStyle: 'italic',
    opacity: 0.7,
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