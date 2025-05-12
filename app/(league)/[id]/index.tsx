// app/(league)/[id]/index.tsx
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { MatchCard } from '@/components/MatchCard';
import { TeamCard } from '@/components/TeamCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    Team,
    useLeagueDetails,
    useLeagueSchedule,
    useLeagueStandings,
    useTeamsByLeague,
} from '@/services/lolEsportsClient';
import { router } from 'expo-router';

// Tab type definition
type TabType = 'schedule' | 'teams' | 'standings';

// LeagueTabs component integrated directly
function LeagueTabs({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ThemedView style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'schedule' && {
            borderBottomColor: Colors[colorScheme].tint,
            borderBottomWidth: 2,
          }
        ]}
        onPress={() => onTabChange('schedule')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'schedule' && {
              color: Colors[colorScheme].tint,
              fontWeight: 'bold',
            }
          ]}
        >
          Schedule
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'teams' && {
            borderBottomColor: Colors[colorScheme].tint,
            borderBottomWidth: 2,
          }
        ]}
        onPress={() => onTabChange('teams')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'teams' && {
              color: Colors[colorScheme].tint,
              fontWeight: 'bold',
            }
          ]}
        >
          Teams
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'standings' && {
            borderBottomColor: Colors[colorScheme].tint,
            borderBottomWidth: 2,
          }
        ]}
        onPress={() => onTabChange('standings')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'standings' && {
              color: Colors[colorScheme].tint,
              fontWeight: 'bold',
            }
          ]}
        >
          Standings
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

export default function LeagueDetailsScreen() {
  // Get league ID from params
  const { id: leagueId, tab: initialTab } = useLocalSearchParams();
  
  // Set active tab with default (can be overridden by URL param)
  const [activeTab, setActiveTab] = useState<TabType>(
    initialTab === 'teams' || initialTab === 'standings' ? initialTab : 'schedule'
  );
  
  // Get URL state for optional pagination
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  
  // Common hooks
  const colorScheme = useColorScheme() ?? 'light';
  const { league, loading: leagueLoading } = useLeagueDetails(leagueId as string);
  
  // Tab-specific data hooks
  const { schedule, loading: scheduleLoading, error: scheduleError, pagination } = 
    useLeagueSchedule(leagueId as string, pageToken);
  const { teams, loading: teamsLoading, error: teamsError } = 
    useTeamsByLeague(leagueId as string);
  const { tournament, standings, loading: standingsLoading, error: standingsError } = 
    useLeagueStandings(leagueId as string);
  
  // Combined loading and error states
  const loading = leagueLoading || 
    (activeTab === 'schedule' && scheduleLoading) ||
    (activeTab === 'teams' && teamsLoading) ||
    (activeTab === 'standings' && standingsLoading);
  
  const error = 
    (activeTab === 'schedule' && scheduleError) ||
    (activeTab === 'teams' && teamsError) ||
    (activeTab === 'standings' && standingsError) ||
    null;

  // Update URL when tab changes for better deep linking
  // (Note: This doesn't cause a re-render, just updates the URL)
  useEffect(() => {
    router.setParams({ tab: activeTab });
  }, [activeTab]);

  // Team handling
  const handleTeamPress = (team: Team) => {
    router.push(`/(league)/${leagueId}/team/${team.id}` as any);
  };

  // Match handling
  const handleMatchPress = (matchId: string) => {
    console.log(`Match pressed: ${matchId}`);
  };

  // SCHEDULE TAB CONTENT
  const renderScheduleContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </ThemedView>
      );
    }

    if (scheduleError) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>{scheduleError.message}</ThemedText>
        </ThemedView>
      );
    }

    if (!schedule.events || schedule.events.length === 0) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>No matches scheduled for this league</ThemedText>
        </ThemedView>
      );
    }

    // Group matches by date
    const groupedMatches = schedule.events.reduce((groups: Record<string, any[]>, match: any) => {
      const date = new Date(match.startTime).toISOString().split('T')[0];
      groups[date] = groups[date] || [];
      groups[date].push(match);
      return groups;
    }, {});

    const sortedDates = Object.keys(groupedMatches).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    );

    const renderSection = ({ item: date }: { item: string }) => {
      const displayDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const matches = groupedMatches[date];

      return (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionHeader}>{displayDate}</ThemedText>
          {matches.map((match: any) => (
            <MatchCard
              key={match.match.id}
              id={match.match.id}
              teams={match.match.teams}
              startTime={match.startTime}
              state={match.state}
              blockName={match.blockName}
              strategy={match.match.strategy}
              onPress={handleMatchPress}
            />
          ))}
        </ThemedView>
      );
    };

    return (
      <FlatList
        data={sortedDates}
        renderItem={renderSection}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          pagination?.older ? (
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => setPageToken(pagination.older)}
            >
              <ThemedText style={styles.paginationButtonText}>Load Earlier Matches</ThemedText>
            </TouchableOpacity>
          ) : null
        }
        ListHeaderComponent={
          pagination?.newer ? (
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => setPageToken(pagination.newer)}
            >
              <ThemedText style={styles.paginationButtonText}>Load Newer Matches</ThemedText>
            </TouchableOpacity>
          ) : null
        }
      />
    );
  };

  // TEAMS TAB CONTENT
  const renderTeamsContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </ThemedView>
      );
    }

    if (teamsError) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>{teamsError.message}</ThemedText>
        </ThemedView>
      );
    }

    if (teams.length === 0) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>No teams found for this league</ThemedText>
        </ThemedView>
      );
    }

    return (
      <FlatList
        data={teams}
        renderItem={({ item }) => (
          <TeamCard team={item} onPress={handleTeamPress} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  // STANDINGS TAB CONTENT
  const renderStandingsContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </ThemedView>
      );
    }

    if (standingsError) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>{standingsError.message}</ThemedText>
        </ThemedView>
      );
    }

    if (!tournament || !standings || !standings.stages || standings.stages.length === 0) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText>No standings available for this league</ThemedText>
          {tournament && (
            <>
              <ThemedText style={styles.tournamentInfo}>Tournament: {tournament.name}</ThemedText>
              <ThemedText style={styles.tournamentInfo}>ID: {tournament.id}</ThemedText>
            </>
          )}
        </ThemedView>
      );
    }

    // Get stages, sections and current section
    const stages = standings.stages;
    const sections = stages[selectedStageIndex]?.sections || [];
    const currentSection = sections[selectedSectionIndex];
    const stageName = stages[selectedStageIndex]?.name;

    // Render stage selector
    const renderStageSelector = () => {
      if (stages.length <= 1) return null;

      return (
        <ThemedView style={styles.selectorContainer}>
          <ThemedText style={styles.selectorLabel}>Stage:</ThemedText>
          <ThemedView style={styles.pillContainer}>
            {stages.map((stage, index) => (
              <TouchableOpacity
                key={stage.id}
                style={[
                  styles.pill,
                  selectedStageIndex === index && styles.pillSelected
                ]}
                onPress={() => {
                  setSelectedStageIndex(index);
                  setSelectedSectionIndex(0);
                }}
              >
                <ThemedText
                  style={[
                    styles.pillText,
                    selectedStageIndex === index && styles.pillTextSelected
                  ]}
                >
                  {stage.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      );
    };

    // Render section selector
    const renderSectionSelector = () => {
      if (sections.length <= 1) return null;

      return (
        <ThemedView style={styles.selectorContainer}>
          <ThemedText style={styles.selectorLabel}>Group:</ThemedText>
          <ThemedView style={styles.pillContainer}>
            {sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pill,
                  selectedSectionIndex === index && styles.pillSelected
                ]}
                onPress={() => setSelectedSectionIndex(index)}
              >
                <ThemedText
                  style={[
                    styles.pillText,
                    selectedSectionIndex === index && styles.pillTextSelected
                  ]}
                >
                  {section.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      );
    };

    // Render standings item
    const renderStandingsItem = ({ item }: { item: any }) => {
      return (
        <ThemedView
          style={styles.rankingRow}
          lightColor={item.ordinal % 2 === 0 ? '#f8f8f8' : '#f0f0f0'}
          darkColor={item.ordinal % 2 === 0 ? '#282828' : '#222222'}
        >
          <ThemedText style={styles.rankingPosition}>#{item.ordinal}</ThemedText>
          <ThemedView style={styles.teamContainer}>
            {item.teams.map((team: any, index: number) => (
              <ThemedView key={team.id} style={styles.teamRow}>
                {index > 0 && <ThemedText style={styles.tiedText}>TIED</ThemedText>}
                <ThemedView style={styles.teamInfo}>
                  <Image
                    source={{ uri: team.image }}
                    style={styles.teamLogo}
                    contentFit="contain"
                  />
                  <ThemedView style={styles.teamNameContainer}>
                    <ThemedText style={styles.teamName}>{team.name}</ThemedText>
                    <ThemedText style={styles.teamCode}>{team.code}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.recordContainer}>
                  <ThemedText style={styles.record}>{team.record.wins}W - {team.record.losses}L</ThemedText>
                  <ThemedText style={styles.winRate}>
                    {Math.round((team.record.wins / (team.record.wins + team.record.losses)) * 100)}%
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      );
    };

    return (
      <>
        <ThemedView style={styles.tournamentHeader}>
          <ThemedText style={styles.tournamentName}>{tournament.name}</ThemedText>
          {stageName && <ThemedText style={styles.stageName}>{stageName}</ThemedText>}
        </ThemedView>

        {renderStageSelector()}
        {renderSectionSelector()}

        {currentSection && currentSection.rankings && currentSection.rankings.length > 0 ? (
          <FlatList
            data={currentSection.rankings}
            renderItem={renderStandingsItem}
            keyExtractor={(item) => item.ordinal.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <ThemedView style={styles.sectionHeader}>
                <ThemedText style={styles.sectionHeaderText}>
                  {currentSection.name} Rankings
                </ThemedText>
              </ThemedView>
            }
          />
        ) : (
          <ThemedView style={styles.centerContainer}>
            <ThemedText>No rankings data available for this group</ThemedText>
          </ThemedView>
        )}
      </>
    );
  };

  // Render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'teams':
        return renderTeamsContent();
      case 'standings':
        return renderStandingsContent();
      case 'schedule':
      default:
        return renderScheduleContent();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{league?.name || 'League'}</ThemedText>
        {league?.region && <ThemedText>{league.region}</ThemedText>}
      </ThemedView>

      <LeagueTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ThemedView style={styles.content}>
        {renderTabContent()}
      </ThemedView>
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
    height: 80,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 45,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
  },
  
  // Schedule tab styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  paginationButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Standings tab styles
  tournamentHeader: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stageName: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  tournamentInfo: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  selectorContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorLabel: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  pillSelected: {
    backgroundColor: '#0a7ea4',
  },
  pillText: {
    fontSize: 14,
  },
  pillTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  rankingRow: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    alignItems: 'center',
  },
  rankingPosition: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  teamContainer: {
    flex: 1,
  },
  teamRow: {
    marginBottom: 8,
  },
  tiedText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  teamNameContainer: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamCode: {
    fontSize: 12,
    opacity: 0.7,
  },
  recordContainer: {
    alignItems: 'flex-end',
  },
  record: {
    fontSize: 16,
    fontWeight: '600',
  },
  winRate: {
    fontSize: 12,
    opacity: 0.7,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
    color: 'red',
  },
});