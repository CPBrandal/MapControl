import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Player } from '@/services/lolEsportsClient';

interface PlayerCardProps {
  player: Player;
  onPress?: (player: Player) => void;
  leagueId?: string;
  teamId?: string;
}

export function PlayerCard({ player, onPress, leagueId, teamId }: PlayerCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(player);
    } else if (leagueId && teamId) {
      // Navigate to player details screen
      router.push(`/(league)/${leagueId}/player/${player.id}?teamId=${teamId}` as any);
    }
  };
  
  // Format the player's full name
  const fullName = [player.firstName, player.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableOpacity
      style={styles.playerItem}
      onPress={handlePress}>
      <ThemedView 
        style={styles.playerCard}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a">
        {player.image ? (
          <Image
            source={{ uri: player.image }}
            style={styles.playerImage}
            contentFit="cover"
          />
        ) : (
          <ThemedView style={[styles.playerImage, styles.placeholderImage]}>
            <ThemedText>{player.summonerName.charAt(0)}</ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.playerDetails}>
          <ThemedText type="defaultSemiBold">{player.summonerName}</ThemedText>
          {fullName && <ThemedText>{fullName}</ThemedText>}
          {player.role && (
            <ThemedView style={styles.roleTag}>
              <ThemedText style={styles.roleText}>{player.role.toUpperCase()}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playerItem: {
    marginBottom: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  playerImage: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 30,
  },
  placeholderImage: {
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerDetails: {
    flex: 1,
  },
  roleTag: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
