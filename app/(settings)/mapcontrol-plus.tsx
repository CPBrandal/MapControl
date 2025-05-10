import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapControlPlusScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>MapControl+</ThemedText>
        <ThemedText style={styles.subtitle}>
          Upgrade to Premium for exclusive features
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.planContainer}>
        <ThemedView style={styles.planCard}>
          <ThemedText style={styles.planTitle}>Monthly</ThemedText>
          <ThemedText style={styles.planPrice}>$4.99</ThemedText>
          <ThemedText style={styles.planPeriod}>per month</ThemedText>
          
          <TouchableOpacity style={styles.subscribeButton}>
            <ThemedText style={styles.buttonText}>Subscribe</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={[styles.planCard, styles.bestValue]}>
          <ThemedView style={styles.bestValueBadge}>
            <ThemedText style={styles.bestValueText}>Best Value</ThemedText>
          </ThemedView>
          <ThemedText style={styles.planTitle}>Annual</ThemedText>
          <ThemedText style={styles.planPrice}>$39.99</ThemedText>
          <ThemedText style={styles.planPeriod}>per year</ThemedText>
          <ThemedText style={styles.savings}>Save over 30%</ThemedText>
          
          <TouchableOpacity style={[styles.subscribeButton, styles.subscribeButtonHighlight]}>
            <ThemedText style={styles.buttonText}>Subscribe</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.featuresContainer}>
        <ThemedText style={styles.featuresTitle}>Premium Features</ThemedText>
        <ThemedView style={styles.featureRow}>
          <ThemedText style={styles.featureBullet}>•</ThemedText>
          <ThemedText style={styles.featureText}>Ad-free experience</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureRow}>
          <ThemedText style={styles.featureBullet}>•</ThemedText>
          <ThemedText style={styles.featureText}>Exclusive tournament statistics</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureRow}>
          <ThemedText style={styles.featureBullet}>•</ThemedText>
          <ThemedText style={styles.featureText}>Team and player performance analytics</ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureRow}>
          <ThemedText style={styles.featureBullet}>•</ThemedText>
          <ThemedText style={styles.featureText}>Early access to new features</ThemedText>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginHorizontal: 40,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    position: 'relative',
  },
  bestValue: {
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  planPeriod: {
    fontSize: 14,
    opacity: 0.7,
  },
  savings: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: 'bold',
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonHighlight: {
    backgroundColor: '#0a7ea4',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 18,
    marginRight: 8,
    color: '#0a7ea4',
  },
  featureText: {
    fontSize: 16,
  },
});