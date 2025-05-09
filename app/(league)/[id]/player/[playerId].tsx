import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTeamDetails } from '@/services/lolEsportsClient';

export default function PlayerDetailsScreen() {
  // Extract all URL parameters
  const { id, teamId, playerId } = useLocalSearchParams();
  const { team, loading, error } = useTeamDetails(teamId as string);
  const colorScheme = useColorScheme() ?? 'light';
  
  // Find the player in the team's players array
  const player = team?.players.find(p => p.id === playerId);

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
      ) : player ? (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            {player.image ? (
              <Image
                source={{ uri: player.image }}
                style={styles.playerImage}
                contentFit="cover"
              />
            ) : (
              <ThemedView style={[styles.playerImage, styles.placeholderImage]}>
                <ThemedText style={styles.placeholderText}>
                  {player.summonerName.charAt(0)}
                </ThemedText>
              </ThemedView>
            )}
            
            <ThemedView style={styles.playerInfo}>
              <ThemedText type="title">{player.summonerName}</ThemedText>
              
              {player.firstName && player.lastName && (
                <ThemedText style={styles.realName}>
                  {player.firstName} {player.lastName}
                </ThemedText>
              )}
              
              {player.role && (
                <ThemedView style={styles.roleTag}>
                  <ThemedText style={styles.roleText}>
                    {player.role.toUpperCase()}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.details}>
            <ThemedText type="subtitle">Player Information</ThemedText>
            
            <ThemedView style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Team:</ThemedText>
              <ThemedText>{team?.name || 'Unknown'}</ThemedText>
            </ThemedView>
            
            {team?.code && (
              <ThemedView style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Team Code:</ThemedText>
                <ThemedText>{team.code}</ThemedText>
              </ThemedView>
            )}
            
            {player.teamName && (
              <ThemedView style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Team Name:</ThemedText>
                <ThemedText>{player.teamName}</ThemedText>
              </ThemedView>
            )}
            
            {team?.homeLeague?.region && (
              <ThemedView style={styles.infoItem}>
                <ThemedText style={styles.infoLabel}>Region:</ThemedText>
                <ThemedText>{team.homeLeague.region}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.errorContainer}>
          <ThemedText>Player not found</ThemedText>
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
  content: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
    alignItems: 'center',
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  playerInfo: {
    alignItems: 'center',
  },
  realName: {
    marginTop: 8,
    fontSize: 18,
  },
  roleTag: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  roleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginTop: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
});