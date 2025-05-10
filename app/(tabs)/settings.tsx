import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

// Define valid icon names based on the IconSymbol component mapping
type IconName = 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right' | 'star.fill';

interface SettingsItemProps {
  title: string;
  icon: IconName; // Use the specific IconName type
  route: string; // Use string as type
}

const SettingsItem = ({ title, icon, route }: SettingsItemProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => router.push(route as any)} // Use type assertion to bypass type checking
    >
      <ThemedView style={styles.settingItemLeft}>
        <IconSymbol
          name={icon}
          size={24}
          color={Colors[colorScheme].icon}
        />
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
      </ThemedView>
      <IconSymbol
        name="chevron.right"
        size={20}
        color={Colors[colorScheme].icon}
      />
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const items: SettingsItemProps[] = [
    {
      title: 'Profile',
      icon: 'house.fill',
      route: '/(settings)/profile'
    },
    {
      title: 'MapControl+',
      icon: 'star.fill',
      route: '/(settings)/mapcontrol-plus'
    },
    {
      title: 'Notifications',
      icon: 'paperplane.fill',
      route: '/(settings)/notifications'
    },
    {
      title: 'More',
      icon: 'chevron.right',
      route: '/(settings)/more'
    }
  ];
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.settingsSection}>
        {items.map((item, index) => (
          <SettingsItem
            key={index}
            title={item.title}
            icon={item.icon}
            route={item.route}
          />
        ))}
      </ThemedView>
      
      <ThemedView style={styles.versionContainer}>
        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  versionContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    opacity: 0.6,
  },
});