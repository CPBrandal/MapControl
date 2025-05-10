import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, TouchableOpacity } from 'react-native';

import { LeagueCard } from '@/components/LeagueCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { League, useLeagues } from '@/services/lolEsportsClient';

export default function LeaguesScreen() {
  const { leagues, loading, error } = useLeagues();
  const colorScheme = useColorScheme() ?? 'light';
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');

  const handleLeaguePress = (league: League) => {
    router.push(`/(league)/${league.id}/teams` as any);
  };

  // Group leagues by region
  const groupedLeagues = leagues.reduce((acc, league) => {
    const region = league.region || 'Other';
    
    if (!acc[region]) {
      acc[region] = [];
    }
    
    acc[region].push(league);
    return acc;
  }, {} as Record<string, League[]>);

  // Convert to SectionList format
  const sections = Object.entries(groupedLeagues)
    .map(([region, leagueList]) => ({
      title: region,
      data: leagueList,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  // Sort each section's leagues by display priority
  sections.forEach(section => {
    section.data.sort((a, b) => 
      (a.displayPriority?.position || 999) - (b.displayPriority?.position || 999)
    );
  });

  const renderLeague = ({ item }: { item: League }) => (
    <LeagueCard 
      league={item} 
      onPress={handleLeaguePress}
    />
  );

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grouped' ? 'flat' : 'grouped');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">LoL Esports Leagues</ThemedText>
      </ThemedView>

      <ThemedView style={styles.viewToggle}>
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={toggleViewMode}
        >
          <ThemedText style={styles.toggleText}>
            {viewMode === 'grouped' ? 'Switch to Flat View' : 'Group by Region'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

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
      ) : viewMode === 'grouped' ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderLeague}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedView 
              style={styles.sectionHeader}
              lightColor="#e0e0e0"
              darkColor="#222222"
            >
              <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            </ThemedView>
          )}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
        />
      ) : (
        <SectionList
          sections={[{ title: 'All Leagues', data: leagues }]}
          keyExtractor={(item) => item.id}
          renderItem={renderLeague}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingBottom: 20,
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
  sectionHeader: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  viewToggle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
});