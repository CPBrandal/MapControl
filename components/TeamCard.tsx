import { Image } from 'expo-image';
import { GestureResponderEvent, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Team } from '@/services/lolEsportsClient';

interface TeamCardProps {
  team: Team;
  onPress: (team: Team) => void;
  compact?: boolean;
}

export function TeamCard({ team, onPress, compact = false }: TeamCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(team.id);

  const handleToggleFavorite = (event: GestureResponderEvent) => {
    // Prevent the card press event from triggering
    event.stopPropagation();
    toggleFavorite(team);
  };

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
        
        {/* Favorite Star Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          {favorite ? (
            // Filled star
            <IconSymbol 
              name="star.fill" 
              size={24} 
              color="white" 
            />
          ) : (
            // Two-layered approach for an outlined star effect
            <ThemedView style={styles.starContainer}>
              {/* White background (slightly larger) */}
              <IconSymbol 
                name="star.fill" 
                size={26} 
                color="white" 
                style={styles.starBackground}
              />
              {/* Colored icon on top (slightly smaller) */}
              <IconSymbol 
                name="star.fill" 
                size={22} 
                color="#2a2a2a"  // Use the dark background color for the inner star
                style={styles.starForeground}
              />
            </ThemedView>
          )}
        </TouchableOpacity>
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
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer: {
    position: 'relative',
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starBackground: {
    position: 'absolute',
  },
  starForeground: {
    position: 'absolute',
  },
});