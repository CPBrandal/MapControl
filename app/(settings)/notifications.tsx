import { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [categories, setCategories] = useState({
    matchAlerts: true,
    newsUpdates: true,
    teamUpdates: false,
    tournamentStart: true,
    standings: false,
  });

  const toggleCategory = (category: keyof typeof categories) => {
    setCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.mainToggle}>
        <ThemedText style={styles.mainToggleTitle}>Enable Notifications</ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
        />
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Categories</ThemedText>
        
        <ThemedView style={styles.categoriesContainer}>
          <ThemedView style={styles.categoryItem}>
            <ThemedText>Match Alerts</ThemedText>
            <Switch
              value={categories.matchAlerts}
              onValueChange={() => toggleCategory('matchAlerts')}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
          
          <ThemedView style={styles.categoryItem}>
            <ThemedText>News Updates</ThemedText>
            <Switch
              value={categories.newsUpdates}
              onValueChange={() => toggleCategory('newsUpdates')}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
          
          <ThemedView style={styles.categoryItem}>
            <ThemedText>Team Updates</ThemedText>
            <Switch
              value={categories.teamUpdates}
              onValueChange={() => toggleCategory('teamUpdates')}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
          
          <ThemedView style={styles.categoryItem}>
            <ThemedText>Tournament Start</ThemedText>
            <Switch
              value={categories.tournamentStart}
              onValueChange={() => toggleCategory('tournamentStart')}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
          
          <ThemedView style={styles.categoryItem}>
            <ThemedText>Standings Updates</ThemedText>
            <Switch
              value={categories.standings}
              onValueChange={() => toggleCategory('standings')}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notification Time</ThemedText>
        <ThemedView style={styles.categoriesContainer}>
          <ThemedView style={styles.categoryItem}>
            <ThemedText>Notify 30 minutes before matches</ThemedText>
            <Switch
              value={true}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              disabled={!notificationsEnabled}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  mainToggleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
});