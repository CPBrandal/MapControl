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
  summonerName: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  role?: string;
  teamName?: string;
}

export interface Team {
  id: string;
  slug: string;
  name: string;
  code: string;
  image?: string;
  alternativeImage?: string;
  backgroundImage?: string;
  status: string;
  homeLeague?: {
    name: string;
    region: string;
  };
  players: Player[];
}

export interface NewsItem {
  id: string;
  title: string;
  author?: string;
  date: string;
  imageUrl?: string;
  summary?: string;
  content?: string;
  tags?: string[];
  url?: string;
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

  // Fetch all teams
  async getTeams(): Promise<Team[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getTeams?hl=en-US`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.data.teams || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  }

  // Fetch teams for a specific league
  async getTeamsByLeague(leagueId: string): Promise<Team[]> {
    try {
      // First get all teams
      const allTeams = await this.getTeams();
      
      // Then filter by the homeLeague.name matching the league we want
      // We need to get the league name first
      const league = await this.getLeagueById(leagueId);
      
      if (!league) {
        throw new Error(`League with ID ${leagueId} not found`);
      }
      
      // Filter teams that belong to this league and are active
      return allTeams.filter(team => 
        team.homeLeague?.name === league.name && 
        team.status === 'active'
      );
    } catch (error) {
      console.error(`Error fetching teams for league ${leagueId}:`, error);
      throw error;
    }
  }

  // Fetch a specific team by ID
  async getTeamById(teamId: string): Promise<Team | null> {
    try {
      const allTeams = await this.getTeams();
      return allTeams.find(team => team.id === teamId) || null;
    } catch (error) {
      console.error(`Error fetching team with ID ${teamId}:`, error);
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

  // Fetch news
  async getNews(options?: { leagueId?: string; tournamentId?: string; limit?: number }): Promise<NewsItem[]> {
    try {
      // Build the URL with optional parameters
      let url = `${this.baseUrl}/getNews?hl=en-US`;
      
      if (options?.leagueId) {
        url += `&leagueId=${options.leagueId}`;
      }
      
      if (options?.tournamentId) {
        url += `&tournamentId=${options.tournamentId}`;
      }
      
      if (options?.limit) {
        url += `&limit=${options.limit}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Note: This is a placeholder. The actual structure might differ based on the API.
      return data.data.news || [];
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
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

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getTeams();
        setTeams(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { teams, loading, error };
}

export function useTeamsByLeague(leagueId: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getTeamsByLeague(leagueId);
        setTeams(data);
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

  return { teams, loading, error };
}

export function useTeamDetails(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getTeamById(teamId);
        setTeam(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  return { team, loading, error };
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

export function useNews(options?: { leagueId?: string; tournamentId?: string; limit?: number }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getNews(options);
        setNews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.leagueId, options?.tournamentId, options?.limit]);

  return { news, loading, error };
}