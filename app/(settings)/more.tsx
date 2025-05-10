import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, TouchableOpacity } from 'react-native';

// Define the valid icon names that match the mapping in IconSymbol.tsx
type IconName = 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right' | 'star.fill';

interface MoreItemProps {
  title: string;
  icon: IconName; // Use the specific IconName type
  onPress: () => void;
  showArrow?: boolean;
}

const MoreItem = ({ title, icon, onPress, showArrow = true }: MoreItemProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
    >
      <ThemedView style={styles.settingItemLeft}>
        <IconSymbol
          name={icon}
          size={24}
          color={Colors[colorScheme].icon}
        />
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
      </ThemedView>
      {showArrow && (
        <IconSymbol
          name="chevron.right"
          size={20}
          color={Colors[colorScheme].icon}
        />
      )}
    </TouchableOpacity>
  );
};

export default function MoreScreen() {
  const handleNavigation = (route: string) => {
    // This would be replaced with actual navigation to these routes
    console.log(`Navigating to: ${route}`);
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App</ThemedText>
        <ThemedView style={styles.settingsSection}>
          <MoreItem
            title="Appearance"
            icon="house.fill"
            onPress={() => handleNavigation('/appearance')}
          />
          <MoreItem
            title="Language"
            icon="house.fill"
            onPress={() => handleNavigation('/language')}
          />
          <MoreItem
            title="Data Usage"
            icon="house.fill"
            onPress={() => handleNavigation('/data-usage')}
          />
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Support</ThemedText>
        <ThemedView style={styles.settingsSection}>
          <MoreItem
            title="Help Center"
            icon="house.fill"
            onPress={() => handleNavigation('/help')}
          />
          <MoreItem
            title="Contact Us"
            icon="house.fill"
            onPress={() => handleNavigation('/contact')}
          />
          <MoreItem
            title="Report a Bug"
            icon="house.fill"
            onPress={() => handleNavigation('/report-bug')}
          />
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Legal</ThemedText>
        <ThemedView style={styles.settingsSection}>
          <MoreItem
            title="Terms of Service"
            icon="house.fill"
            onPress={() => handleNavigation('/terms')}
          />
          <MoreItem
            title="Privacy Policy"
            icon="house.fill"
            onPress={() => handleNavigation('/privacy')}
          />
          <MoreItem
            title="Licenses"
            icon="house.fill"
            onPress={() => handleNavigation('/licenses')}
          />
        </ThemedView>
      </ThemedView>
      
      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 12,
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
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
});