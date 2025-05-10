import { Team } from '@/services/lolEsportsClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// The key we'll use in AsyncStorage
const FAVORITES_STORAGE_KEY = 'favoriteTeams';

// Define the context type
interface FavoritesContextType {
  favoriteTeamIds: string[];
  isFavorite: (teamId: string) => boolean;
  toggleFavorite: (team: Team) => Promise<void>;
  favoriteTeams: Team[];
  loadingFavorites: boolean;
}

// Create the context
const FavoritesContext = createContext<FavoritesContextType>({
  favoriteTeamIds: [],
  isFavorite: () => false,
  toggleFavorite: async () => {},
  favoriteTeams: [],
  loadingFavorites: true,
});

// Custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);

// Provider component
export const FavoritesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [favoriteTeamIds, setFavoriteTeamIds] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // Load favorites from AsyncStorage when the app starts
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavoriteTeamIds(parsedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, []);

  // Check if a team is a favorite
  const isFavorite = (teamId: string) => {
    return favoriteTeamIds.includes(teamId);
  };

  // Toggle a team's favorite status
  const toggleFavorite = async (team: Team) => {
    try {
      let updatedFavorites: string[];
      let updatedTeams: Team[];
      
      if (isFavorite(team.id)) {
        // Remove from favorites
        updatedFavorites = favoriteTeamIds.filter(id => id !== team.id);
        updatedTeams = favoriteTeams.filter(t => t.id !== team.id);
      } else {
        // Add to favorites
        updatedFavorites = [...favoriteTeamIds, team.id];
        updatedTeams = [...favoriteTeams, team];
      }
      
      // Update state
      setFavoriteTeamIds(updatedFavorites);
      setFavoriteTeams(updatedTeams);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      
      // Also save the team objects for quick access
      await AsyncStorage.setItem('favoriteTeamsData', JSON.stringify(updatedTeams));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Load the actual team objects when the app starts
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await AsyncStorage.getItem('favoriteTeamsData');
        if (teamsData) {
          setFavoriteTeams(JSON.parse(teamsData));
        }
      } catch (error) {
        console.error('Error loading team objects:', error);
      }
    };

    if (!loadingFavorites) {
      loadTeams();
    }
  }, [loadingFavorites]);

  return (
    <FavoritesContext.Provider 
      value={{ 
        favoriteTeamIds, 
        isFavorite, 
        toggleFavorite, 
        favoriteTeams, 
        loadingFavorites 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};