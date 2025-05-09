import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Team {
  name: string;
  code: string;
  image: string;
  result?: {
    outcome: string | null;
    gameWins: number;
  };
  record?: {
    wins: number;
    losses: number;
  };
}

interface MatchProps {
  id: string;
  teams: Team[];
  startTime: string;
  state: 'unstarted' | 'inProgress' | 'completed';
  blockName?: string;
  strategy?: {
    type: string;
    count: number;
  };
  onPress?: (matchId: string) => void;
}

export function MatchCard({ id, teams, startTime, state, blockName, strategy, onPress }: MatchProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Format the match date
  const matchDate = new Date(startTime);
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  // Format the match time
  const formattedTime = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Determine if there is a match result to show
  const hasResult = state === 'completed' && teams[0].result && teams[1].result;
  
  const getStatusColor = () => {
    switch (state) {
      case 'inProgress':
        return '#e74c3c'; // Red for live
      case 'completed':
        return '#7f8c8d'; // Gray for completed
      default:
        return '#2ecc71'; // Green for upcoming
    }
  };
  
  const getStatusText = () => {
    switch (state) {
      case 'inProgress':
        return 'LIVE';
      case 'completed':
        return 'COMPLETED';
      default:
        return 'UPCOMING';
    }
  };
  
  return (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => onPress?.(id)}
      disabled={!onPress}
    >
      <ThemedView
        style={styles.matchContainer}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a"
      >
        {/* Match info header */}
        <ThemedView style={styles.matchHeader}>
          <ThemedView>
            <ThemedText style={styles.blockName}>{blockName || ''}</ThemedText>
            <ThemedText style={styles.matchTime}>
              {formattedDate} • {formattedTime}
            </ThemedText>
          </ThemedView>
          
          <ThemedView 
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <ThemedText style={styles.statusText}>
              {getStatusText()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        {/* Match teams */}
        <ThemedView style={styles.teamsContainer}>
          {/* Team 1 */}
          <ThemedView style={styles.teamContainer}>
            <Image
              source={{ uri: teams[0].image }}
              style={styles.teamLogo}
              contentFit="contain"
            />
            <ThemedView style={styles.teamInfo}>
              <ThemedText type="defaultSemiBold">{teams[0].name}</ThemedText>
              <ThemedText style={styles.teamRecord}>
                {teams[0].record ? `${teams[0].record.wins}-${teams[0].record.losses}` : ''}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          {/* VS or Score */}
          <ThemedView style={styles.scoreContainer}>
            {hasResult ? (
              <ThemedText style={styles.score}>
                {teams[0].result!.gameWins} - {teams[1].result!.gameWins}
              </ThemedText>
            ) : (
              <ThemedText style={styles.vs}>VS</ThemedText>
            )}
            
            {strategy && (
              <ThemedText style={styles.matchFormat}>
                {strategy.type === 'bestOf' ? `BO${strategy.count}` : strategy.type}
              </ThemedText>
            )}
          </ThemedView>
          
          {/* Team 2 */}
          <ThemedView style={[styles.teamContainer, styles.teamRight]}>
            <ThemedView style={[styles.teamInfo, styles.teamInfoRight]}>
              <ThemedText type="defaultSemiBold">{teams[1].name}</ThemedText>
              <ThemedText style={styles.teamRecord}>
                {teams[1].record ? `${teams[1].record.wins}-${teams[1].record.losses}` : ''}
              </ThemedText>
            </ThemedView>
            <Image
              source={{ uri: teams[1].image }}
              style={styles.teamLogo}
              contentFit="contain"
            />
          </ThemedView>
        </ThemedView>
        
        {/* Winner indicator */}
        {hasResult && (
          <ThemedView style={styles.resultContainer}>
            <ThemedText style={styles.resultText}>
              {teams[0].result!.outcome === 'win' 
                ? `${teams[0].name} won` 
                : `${teams[1].name} won`}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  matchCard: {
    marginBottom: 16,
  },
  matchContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  blockName: {
    fontSize: 12,
    opacity: 0.7,
  },
  matchTime: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  teamContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamRight: {
    justifyContent: 'flex-end',
  },
  teamLogo: {
    width: 40,
    height: 40,
  },
  teamInfo: {
    marginLeft: 12,
    flex: 1,
  },
  teamInfoRight: {
    marginLeft: 0,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  teamRecord: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  matchFormat: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  resultContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});