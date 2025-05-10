// components/LiveMatchCard.tsx

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { GestureResponderEvent, Linking, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LiveEvent } from '@/services/lolEsportsClient';

interface LiveMatchCardProps {
  match: LiveEvent;
}

export function LiveMatchCard({ match }: LiveMatchCardProps) {
  // Add null checks to prevent undefined errors
  if (!match || !match.match) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Invalid match data</ThemedText>
      </ThemedView>
    );
  }

  const { teams } = match.match;
  
  // Get the current game score
  const team1Score = teams?.[0]?.result?.gameWins || 0;
  const team2Score = teams?.[1]?.result?.gameWins || 0;
  
  // Format the start time for in-progress matches
  const formatStartTime = () => {
    if (match.state === 'inProgress' && match.startTime) {
      const startTime = new Date(match.startTime);
      const hours = startTime.getUTCHours();
      const minutes = startTime.getUTCMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `Starting ${formattedHours}:${formattedMinutes} UTC`;
    }
    return '';
  };

  // Find the current game that's in progress
  const getCurrentGameId = () => {
    if (!match.match.games) {
      console.log('No games found in match:', match.match.id);
      return null;
    }
    const currentGame = match.match.games.find(game => game.state === 'inProgress');
    if (currentGame) {
      console.log('Found in-progress game:', currentGame.id);
      return currentGame.id;
    } else {
      console.log('No in-progress game found. Games states:', 
        match.match.games.map(g => ({ id: g.id, state: g.state })));
      return null;
    }
  };

  // Handle card press to view live stats
  const handleMatchPress = () => {
    const currentGameId = getCurrentGameId();
    console.log('Navigating to game ID:', currentGameId);
    if (currentGameId) {
      router.push(`/(live)/${currentGameId}` as any);
    }
  };
  
  // Find a stream (prefer English if available)
  const findPreferredStream = () => {
    if (!match.streams || match.streams.length === 0) return null;
    
    // Try to find English stream first
    const englishStream = match.streams.find(stream => 
      stream.locale.startsWith('en') && 
      (stream.provider === 'twitch' || stream.provider === 'youtube')
    );
    
    // If no English stream, just get the first available one
    const anyStream = match.streams.find(stream => 
      stream.provider === 'twitch' || stream.provider === 'youtube'
    );
    
    return englishStream || anyStream;
  };
  
  const preferredStream = findPreferredStream();
  
  const handleWatchStream = (event: GestureResponderEvent) => {
    // Prevent the card press event from triggering
    event.stopPropagation();
    
    if (!preferredStream) return;
    
    let url = '';
    if (preferredStream.provider === 'twitch') {
      url = `https://www.twitch.tv/${preferredStream.parameter}`;
    } else if (preferredStream.provider === 'youtube') {
      url = `https://www.youtube.com/watch?v=${preferredStream.parameter}`;
    }
    
    if (url) {
      Linking.openURL(url);
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={handleMatchPress}
      disabled={!getCurrentGameId()}
      style={styles.touchable}
    >
      <ThemedView 
        style={styles.container}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a"
      >
        {/* League & Live indicator */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.leagueInfo}>
            {match.league?.image && (
              <Image 
                source={{ uri: match.league.image }} 
                style={styles.leagueLogo} 
                contentFit="contain" 
              />
            )}
            <ThemedText>{match.league?.name || 'Unknown League'}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.liveIndicator}>
            <ThemedView style={styles.liveStatusDot} />
            <ThemedText style={styles.liveText}>LIVE</ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Start time for in-progress matches */}
        {match.state === 'inProgress' && (
          <ThemedView style={styles.startTimeContainer}>
            <ThemedText style={styles.startTimeText}>
              {formatStartTime()}
            </ThemedText>
          </ThemedView>
        )}
        
        {/* Teams */}
        <ThemedView style={styles.matchInfo}>
          <ThemedView style={styles.teamRow}>
            {/* Team 1 */}
            <ThemedView style={styles.teamContainer}>
              {teams?.[0]?.image ? (
                <Image
                  source={{ uri: teams[0].image }}
                  style={styles.teamLogo}
                  contentFit="contain"
                />
              ) : (
                <ThemedView style={styles.placeholderLogo}>
                  <ThemedText>{teams?.[0]?.code || '?'}</ThemedText>
                </ThemedView>
              )}
              <ThemedText style={styles.teamName}>{teams?.[0]?.name || 'Unknown Team'}</ThemedText>
            </ThemedView>
            
            {/* Score */}
            <ThemedView style={styles.scoreContainer}>
              <ThemedText style={styles.score}>{team1Score} - {team2Score}</ThemedText>
              <ThemedText style={styles.bestOf}>
                {match.match.strategy?.type === 'bestOf' ? 
                  `BO${match.match.strategy.count}` : 
                  match.match.strategy?.type || 'Unknown Format'}
              </ThemedText>
            </ThemedView>
            
            {/* Team 2 */}
            <ThemedView style={styles.teamContainer}>
              {teams?.[1]?.image ? (
                <Image
                  source={{ uri: teams[1].image }}
                  style={styles.teamLogo}
                  contentFit="contain"
                />
              ) : (
                <ThemedView style={styles.placeholderLogo}>
                  <ThemedText>{teams?.[1]?.code || '?'}</ThemedText>
                </ThemedView>
              )}
              <ThemedText style={styles.teamName}>{teams?.[1]?.name || 'Unknown Team'}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        {/* Watch button */}
        <TouchableOpacity 
          style={styles.watchButton}
          onPress={handleWatchStream}
          disabled={!preferredStream}
        >
          <ThemedText style={styles.watchButtonText}>Watch Stream</ThemedText>
        </TouchableOpacity>
        
        {getCurrentGameId() && (
          <ThemedView style={styles.tapHint}>
            <ThemedText style={styles.tapHintText}>Tap to view live stats</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 16,
  },
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startTimeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  startTimeText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  matchInfo: {
    padding: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  placeholderLogo: {
    width: 50,
    height: 50,
    backgroundColor: '#0a7ea4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bestOf: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  watchButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    alignItems: 'center',
  },
  watchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tapHint: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tapHintText: {
    fontSize: 12,
    opacity: 0.7,
  },
});