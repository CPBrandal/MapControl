import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Team } from '@/services/lolEsportsClient';

interface TeamCardProps {
  team: Team;
  onPress: (team: Team) => void;
  compact?: boolean;
}

export function TeamCard({ team, onPress, compact = false }: TeamCardProps) {
  return (
    <TouchableOpacity
      style={styles.teamItem}
      onPress={() => onPress(team)}>
      <ThemedView 
        style={styles.teamCard}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a">
        {team.image ? (
          <Image
            source={{ uri: team.image }}
            style={[
              styles.teamLogo, 
              compact ? styles.teamLogoCompact : {}
            ]}
            contentFit="contain"
          />
        ) : (
          <ThemedView style={[
            styles.teamLogo, 
            styles.placeholderLogo,
            compact ? styles.teamLogoCompact : {}
          ]}>
            <ThemedText>{team.code}</ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.teamDetails}>
          <ThemedText type="defaultSemiBold">{team.name}</ThemedText>
          {team.homeLeague?.region && !compact && (
            <ThemedText>{team.homeLeague.region}</ThemedText>
          )}
          <ThemedText style={styles.playerCount}>
            Players: {team.players?.length || 0}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  teamItem: {
    marginBottom: 12,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 30,
  },
  teamLogoCompact: {
    width: 40,
    height: 40,
  },
  placeholderLogo: {
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamDetails: {
    flex: 1,
  },
  playerCount: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});