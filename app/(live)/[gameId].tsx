// app/(live)/[gameId].tsx

import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    isWindowStatsResponse,
    useLiveMatchStats
} from '@/services/lolEsportsClient';

export default function LiveMatchDetailsScreen() {
  const { gameId } = useLocalSearchParams();
  const { stats, loading, error } = useLiveMatchStats(gameId as string);
  const colorScheme = useColorScheme() ?? 'light';
  
  // Check if we're dealing with window stats response
  if (stats && !isWindowStatsResponse(stats)) {
    // If we have details response, show simpler UI
    return (
      <ThemedView style={styles.container}>
        <ThemedText>This game data is not yet available in the detailed format.</ThemedText>
        <ThemedText>Please check back later or watch the stream for live updates.</ThemedText>
      </ThemedView>
    );
  }
  
  // From here on, we know we're dealing with WindowStatsResponse type
  
  // Get the latest frame with data
  const getLatestFrame = () => {
    if (!stats || !isWindowStatsResponse(stats) || stats.frames.length === 0) return null;
    
    // Find the latest frame with actual data (not all zeros)
    for (let i = stats.frames.length - 1; i >= 0; i--) {
      const frame = stats.frames[i];
      if (frame.blueTeam.totalGold > 0 || frame.redTeam.totalGold > 0) {
        return frame;
      }
    }
    return stats.frames[stats.frames.length - 1];
  };
  
  const latestFrame = getLatestFrame();
  
  // Get player data by matching participant IDs to metadata
  const getPlayerName = (participantId: number) => {
    if (!stats || !isWindowStatsResponse(stats)) return `Player ${participantId}`;
    
    // Check blue team
    const bluePlayer = stats.gameMetadata.blueTeamMetadata.participantMetadata.find(
      p => p.participantId === participantId
    );
    if (bluePlayer) return bluePlayer.summonerName;
    
    // Check red team
    const redPlayer = stats.gameMetadata.redTeamMetadata.participantMetadata.find(
      p => p.participantId === participantId
    );
    if (redPlayer) return redPlayer.summonerName;
    
    return `Player ${participantId}`;
  };
  
  const getPlayerChampion = (participantId: number) => {
    if (!stats || !isWindowStatsResponse(stats)) return "Unknown";
    
    // Check blue team
    const bluePlayer = stats.gameMetadata.blueTeamMetadata.participantMetadata.find(
      p => p.participantId === participantId
    );
    if (bluePlayer) return bluePlayer.championId;
    
    // Check red team
    const redPlayer = stats.gameMetadata.redTeamMetadata.participantMetadata.find(
      p => p.participantId === participantId
    );
    if (redPlayer) return redPlayer.championId;
    
    return "Unknown";
  };
  
  const getGoldDifference = () => {
    if (!latestFrame) return 0;
    return latestFrame.blueTeam.totalGold - latestFrame.redTeam.totalGold;
  };
  
  const renderTeamStats = (isBlueTeam: boolean) => {
    if (!latestFrame) return null;
    
    const team = isBlueTeam ? latestFrame.blueTeam : latestFrame.redTeam;
    
    // Calculate team KDA totals
    const totalKills = team.totalKills;
    const totalDeaths = team.participants.reduce((sum, p) => sum + p.deaths, 0);
    const totalAssists = team.participants.reduce((sum, p) => sum + p.assists, 0);
    
    return (
      <ThemedView style={styles.teamStatsContainer}>
        <ThemedView style={[
          styles.teamHeader, 
          isBlueTeam ? styles.blueTeamHeader : styles.redTeamHeader
        ]}>
          <ThemedText style={styles.teamName}>
            {isBlueTeam ? 'Blue Team' : 'Red Team'}
          </ThemedText>
          <ThemedView style={styles.teamStatsRow}>
            <ThemedText style={styles.statValue}>{team.totalGold}</ThemedText>
            <ThemedText style={styles.statLabel}>Gold</ThemedText>
          </ThemedView>
          <ThemedView style={styles.teamStatsRow}>
            <ThemedText style={styles.statValue}>{totalKills}/{totalDeaths}/{totalAssists}</ThemedText>
            <ThemedText style={styles.statLabel}>K/D/A</ThemedText>
          </ThemedView>
          <ThemedView style={styles.teamStatsRow}>
            <ThemedText style={styles.statValue}>{team.towers}</ThemedText>
            <ThemedText style={styles.statLabel}>Towers</ThemedText>
          </ThemedView>
          <ThemedView style={styles.teamStatsRow}>
            <ThemedText style={styles.statValue}>{team.dragons.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Dragons</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.playersList}>
          {team.participants.map(player => {
            const playerName = getPlayerName(player.participantId);
            const championName = getPlayerChampion(player.participantId);
            
            return (
              <ThemedView 
                key={player.participantId}
                style={[
                  styles.playerCard,
                  isBlueTeam ? styles.blueTeamCard : styles.redTeamCard
                ]}
              >
                <ThemedView style={styles.playerHeader}>
                  <ThemedText style={styles.playerName}>{playerName}</ThemedText>
                  <ThemedText style={styles.championName}>{championName}</ThemedText>
                  <ThemedText style={styles.playerLevel}>Level {player.level}</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.playerStats}>
                  <ThemedView style={styles.statColumn}>
                    <ThemedText style={styles.statValue}>{player.kills}/{player.deaths}/{player.assists}</ThemedText>
                    <ThemedText style={styles.statLabel}>KDA</ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.statColumn}>
                    <ThemedText style={styles.statValue}>{player.creepScore}</ThemedText>
                    <ThemedText style={styles.statLabel}>CS</ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.statColumn}>
                    <ThemedText style={styles.statValue}>{player.totalGold}</ThemedText>
                    <ThemedText style={styles.statLabel}>Gold</ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.healthBar}>
                     <ThemedView 
                        style={[
                            styles.healthBarInner,
                            { width: ((player.currentHealth / player.maxHealth) * 100 + '%') as any }
                        ]}
                        /> 
                    <ThemedText style={styles.healthText}>
                      {player.currentHealth}/{player.maxHealth}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>
    );
  };

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
          <ThemedText style={styles.errorText}>
            {error.message || 'Failed to load match statistics'}
          </ThemedText>
        </ThemedView>
      ) : stats && isWindowStatsResponse(stats) && latestFrame ? (
        <ScrollView>
          <ThemedView style={styles.headerContainer}>
            <ThemedText style={styles.matchTime}>
              Last updated: {new Date(latestFrame.rfc460Timestamp).toLocaleTimeString()}
            </ThemedText>
            
            <ThemedView style={styles.goldDifferenceContainer}>
              <ThemedText style={styles.goldDifferenceLabel}>Gold Difference:</ThemedText>
              <ThemedText 
                style={[
                  styles.goldDifferenceValue,
                  getGoldDifference() > 0 
                    ? styles.blueAdvantage 
                    : getGoldDifference() < 0 
                      ? styles.redAdvantage
                      : styles.evenMatch
                ]}
              >
                {getGoldDifference() > 0 
                  ? `+${getGoldDifference()} Blue` 
                  : getGoldDifference() < 0 
                    ? `+${Math.abs(getGoldDifference())} Red` 
                    : 'Even'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.matchStatsContainer}>
            {renderTeamStats(true)}
            {renderTeamStats(false)}
          </ThemedView>
        </ScrollView>
      ) : (
        <ThemedView style={styles.errorContainer}>
          <ThemedText>No live stats available for this match</ThemedText>
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
    textAlign: 'center',
    color: '#e74c3c',
  },
  headerContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  matchTime: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  goldDifferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldDifferenceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  goldDifferenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueAdvantage: {
    color: '#1E88E5',
  },
  redAdvantage: {
    color: '#E53935',
  },
  evenMatch: {
    color: '#757575',
  },
  matchStatsContainer: {
    marginBottom: 16,
  },
  teamStatsContainer: {
    marginBottom: 16,
  },
  teamHeader: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  blueTeamHeader: {
    backgroundColor: 'rgba(30, 136, 229, 0.2)',
  },
  redTeamHeader: {
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playersList: {
    marginBottom: 16,
  },
  playerCard: {
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
  },
  blueTeamCard: {
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#1E88E5',
  },
  redTeamCard: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  playerName: {
    fontWeight: 'bold',
    flex: 1,
  },
  championName: {
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'center',
  },
  playerLevel: {
    fontWeight: '500',
  },
  playerStats: {
    flexDirection: 'column',
  },
  statColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    color: '#757575',
    fontSize: 12,
  },
  statValue: {
    fontWeight: '500',
  },
  healthBar: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  healthBarInner: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  healthText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});