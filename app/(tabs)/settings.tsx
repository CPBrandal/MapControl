import { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [matchRemindersEnabled, setMatchRemindersEnabled] = useState(false);
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.settingsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Notifications
        </ThemedText>
        
        <ThemedView style={styles.settingItem}>
          <ThemedText>Enable notifications</ThemedText>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
          />
        </ThemedView>
        
        <ThemedView style={styles.settingItem}>
          <ThemedText>Match reminders</ThemedText>
          <Switch
            value={matchRemindersEnabled}
            onValueChange={setMatchRemindersEnabled}
            trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
            disabled={!notificationsEnabled}
          />
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.settingsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          About
        </ThemedText>
        
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText>Version</ThemedText>
          <ThemedText style={styles.settingValue}>1.0.0</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText>Terms of Service</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <ThemedText>Privacy Policy</ThemedText>
        </TouchableOpacity>
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
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingValue: {
    opacity: 0.6,
  },
});
