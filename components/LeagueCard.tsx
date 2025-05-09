import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { League } from '@/services/lolEsportsClient';

interface LeagueCardProps {
  league: League;
  onPress?: (league: League) => void;
  compact?: boolean;
}

export function LeagueCard({ league, onPress, compact = false }: LeagueCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(league);
    } else {
      // Default navigation to teams screen if no custom onPress is provided
      router.push(`/(league)/${league.id}/teams` as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.leagueItem}
      onPress={handlePress}>
      <ThemedView 
        style={styles.leagueCard}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a">
        {league.image ? (
          <Image
            source={{ uri: league.image }}
            style={[
              styles.leagueLogo, 
              compact ? styles.leagueLogoCompact : {}
            ]}
            contentFit="contain"
          />
        ) : (
          <ThemedView style={[
            styles.leagueLogo, 
            styles.placeholderLogo,
            compact ? styles.leagueLogoCompact : {}
          ]}>
            <ThemedText>{league.name.charAt(0)}</ThemedText>
          </ThemedView>
        )}
        <ThemedView style={styles.leagueDetails}>
          <ThemedText type="defaultSemiBold">{league.name}</ThemedText>
          {league.region && !compact && <ThemedText>{league.region}</ThemedText>}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leagueItem: {
    marginBottom: 12,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  leagueLogo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  leagueLogoCompact: {
    width: 40,
    height: 40,
  },
  placeholderLogo: {
    backgroundColor: '#0a7ea4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leagueDetails: {
    flex: 1,
  },
});
