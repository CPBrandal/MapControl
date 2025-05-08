import { useEffect, useState } from 'react';

// Define types based on the API responses
export interface League {
  id: string;
  slug: string;
  name: string;
  region?: string;
  image?: string;
  priority: number;
  displayPriority: {
    position: number;
    status: string;
  };
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  leagueId?: string;
}

export interface Player {
  id: string;
  name: string;
  photoUrl?: string;
  roleSlug?: string;
  teamName?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  players?: Player[];
}

// A direct Riot Games eSports API client that works in React Native
class LolEsportsClient {
  private baseUrl = 'https://esports-api.lolesports.com/persisted/gw';
  private headers = {
    'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
    'Content-Type': 'application/json',
  };

  // Fetch leagues
  async getLeagues(): Promise<League[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getLeagues?hl=en-US`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.data.leagues || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }

  // Fetch a specific league by ID
  async getLeagueById(id: string): Promise<League | null> {
    try {
      const leagues = await this.getLeagues();
      return leagues.find(league => league.id === id) || null;
    } catch (error) {
      console.error(`Error fetching league with ID ${id}:`, error);
      throw error;
    }
  }

  // Fetch tournaments
  async getTournaments(): Promise<Tournament[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getTournamentsForLeague?hl=en-US`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.data.tournaments || [];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }

  // Fetch tournaments for a specific league
  async getTournamentsForLeague(leagueId: string): Promise<Tournament[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getTournamentsForLeague?hl=en-US&leagueId=${leagueId}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.data.tournaments || [];
    } catch (error) {
      console.error(`Error fetching tournaments for league ${leagueId}:`, error);
      throw error;
    }
  }

  // More methods can be added as needed...
}

// Create and export a singleton instance
export const lolEsportsClient = new LolEsportsClient();

// React hooks for easy data fetching
export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getLeagues();
        
        // Sort leagues by display priority if available
        const sortedLeagues = [...data].sort((a, b) => 
          (a.displayPriority?.position || 999) - (b.displayPriority?.position || 999)
        );
        
        setLeagues(sortedLeagues);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { leagues, loading, error };
}

export function useLeagueDetails(leagueId: string) {
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getLeagueById(leagueId);
        setLeague(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchData();
    }
  }, [leagueId]);

  return { league, loading, error };
}

export function useTournaments(leagueId?: string) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = leagueId 
          ? await lolEsportsClient.getTournamentsForLeague(leagueId)
          : await lolEsportsClient.getTournaments();
        setTournaments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  return { tournaments, loading, error };
}
