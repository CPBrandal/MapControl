import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LeagueTabsProps {
  leagueId: string;
  activeTab: 'schedule' | 'teams';
}

export function LeagueTabs({ leagueId, activeTab }: LeagueTabsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  const handleTabPress = (tab: 'schedule' | 'teams') => {
    if (tab !== activeTab) {
      router.replace(`/(league)/${leagueId}/${tab}` as any);
    }
  };
  
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
        onPress={() => handleTabPress('schedule')}
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
        onPress={() => handleTabPress('teams')}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
  },
});