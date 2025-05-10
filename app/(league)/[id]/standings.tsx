import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { LeagueTabs } from '@/components/LeagueTabs';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLeagueDetails, useLeagueStandings } from '@/services/lolEsportsClient';

export default function StandingsScreen() {
  const { id: leagueId } = useLocalSearchParams();
  const { league, loading: leagueLoading } = useLeagueDetails(leagueId as string);
  const { tournament, standings, loading: standingsLoading, error } = useLeagueStandings(leagueId as string);
  const colorScheme = useColorScheme() ?? 'light';
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  
  const loading = leagueLoading || standingsLoading;

  // Get available stages from standings
  const getStages = () => {
    if (!standings || !standings.stages || standings.stages.length === 0) {
      return [];
    }
    return standings.stages;
  };

  // Get sections (groups) from the selected stage
  const getSections = () => {
    const stages = getStages();
    if (stages.length === 0 || !stages[selectedStageIndex].sections) {
      return [];
    }
    return stages[selectedStageIndex].sections;
  };

  // Get the current section with rankings
  const getCurrentSection = () => {
    const sections = getSections();
    if (sections.length === 0 || selectedSectionIndex >= sections.length) {
      return null;
    }
    return sections[selectedSectionIndex];
  };

  const stages = getStages();
  const sections = getSections();
  const currentSection = getCurrentSection();
  const stageName = stages.length > 0 ? stages[selectedStageIndex].name : null;

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

  // Render the stage selector
  const renderStageSelector = () => {
    if (stages.length <= 1) {
      return null; // No need for a selector if there's only one stage
    }

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
                setSelectedSectionIndex(0); // Reset section when stage changes
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

  // Render the section (group) selector
  const renderSectionSelector = () => {
    if (sections.length <= 1) {
      return null; // No need for a selector if there's only one section
    }

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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{league?.name || 'League'}</ThemedText>
        {league?.region && <ThemedText>{league.region}</ThemedText>}
      </ThemedView>

      <LeagueTabs leagueId={leagueId as string} activeTab="standings" />

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
      ) : !tournament || !standings || stages.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>No standings available for this league</ThemedText>
          {tournament && (
            <>
              <ThemedText style={styles.tournamentInfo}>Tournament: {tournament.name}</ThemedText>
              <ThemedText style={styles.tournamentInfo}>ID: {tournament.id}</ThemedText>
            </>
          )}
        </ThemedView>
      ) : (
        <ThemedView style={styles.content}>
          <ThemedView style={styles.tournamentHeader}>
            <ThemedText style={styles.tournamentName}>{tournament.name}</ThemedText>
            {stageName && <ThemedText style={styles.stageName}>{stageName}</ThemedText>}
          </ThemedView>
          
          {/* Stage and Section selectors */}
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
            <ThemedView style={styles.emptyContainer}>
              <ThemedText>No rankings data available for this group</ThemedText>
            </ThemedView>
          )}
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
  content: {
    flex: 1,
  },
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
  tournamentInfo: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  }
});