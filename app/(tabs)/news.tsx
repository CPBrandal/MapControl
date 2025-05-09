import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the news item interface
interface NewsItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  summary: string;
}

// Mock news data to display initially
const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'LEC Summer Split Begins Next Week',
    date: '2025-05-05',
    imageUrl: 'https://via.placeholder.com/150',
    summary: 'The LEC Summer Split is set to begin next week with 10 teams competing.'
  },
  {
    id: '2',
    title: 'World Champions Announce Roster Changes',
    date: '2025-05-03',
    imageUrl: 'https://via.placeholder.com/150',
    summary: 'Last year\'s World Champions have announced significant roster changes for the upcoming season.'
  },
  {
    id: '3',
    title: 'New Tournament Format Revealed',
    date: '2025-05-01',
    imageUrl: 'https://via.placeholder.com/150',
    summary: 'Riot Games has announced a new tournament format for international competitions.'
  }
];

export default function NewsScreen() {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  // In the future, you could implement real news fetching here
  useEffect(() => {
    // This would be replaced with actual API calls
    setLoading(false);
  }, []);

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.newsItem}>
      <ThemedView 
        style={styles.newsCard}
        lightColor="#f0f0f0"
        darkColor="#2a2a2a">
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.newsImage}
          contentFit="cover"
        />
        <ThemedView style={styles.newsContent}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          <ThemedText style={styles.newsDate}>{item.date}</ThemedText>
          <ThemedText numberOfLines={2}>{item.summary}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">LoL Esports News</ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme].tint}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
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
  newsItem: {
    marginBottom: 16,
  },
  newsCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  newsImage: {
    height: 150,
    width: '100%',
  },
  newsContent: {
    padding: 16,
  },
  newsDate: {
    fontSize: 12,
    marginVertical: 4,
    opacity: 0.7,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
