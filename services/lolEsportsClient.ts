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
  result?: {
    outcome: string | null;
    gameWins: number;
  };
  record?: {
    wins: number;
    losses: number;
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

export interface LiveEvent {
  id: string;
  startTime: string;
  state: 'inProgress' | 'completed' | 'unstarted';
  blockName: string;
  league: League;
  match: {
    id: string;
    teams: Team[];
    strategy: {
      type: string;
      count: number;
    };
    games: {
      number: number;
      id: string;
      state: 'completed' | 'inProgress' | 'unstarted';
      teams: {
        id: string;
        side: 'blue' | 'red';
      }[];
    }[];
  };
  streams: {
    parameter: string;
    locale: string;
    provider: string;
    countries: string[];
    offset: number;
  }[];
}

export interface ParticipantStats {
  participantId: number;
  level: number;
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  totalGold: number;
  currentHealth: number;
  maxHealth: number;
  totalGoldEarned: number;
  killParticipation: number;
  championDamageShare: number;
  wardsPlaced: number;
  wardsDestroyed: number;
  attackDamage: number;
  abilityPower: number;
  criticalChance: number;
  attackSpeed: number;
  lifeSteal: number;
  armor: number;
  magicResistance: number;
  tenacity: number;
  items: number[];
  perkMetadata: {
    styleId: number;
    subStyleId: number;
    perks: number[];
  };
  abilities: string;
}

export interface StatsFrame {
  rfc460Timestamp: string;
  participants: ParticipantStats[];
}

export interface LiveStatsResponse {
  frames: StatsFrame[];
}

// Add to services/lolEsportsClient.ts

export interface LiveStatsDetailsResponse {
  frames: StatsFrame[];
}

export interface StatsFrame {
  rfc460Timestamp: string;
  participants: ParticipantStats[];
}

// Add the window response interface
export interface WindowStatsResponse {
  esportsGameId: string;
  esportsMatchId: string;
  gameMetadata: {
    patchVersion: string;
    blueTeamMetadata: {
      esportsTeamId: string;
      participantMetadata: {
        participantId: number;
        esportsPlayerId: string;
        summonerName: string;
        championId: string;
        role: string;
      }[];
    };
    redTeamMetadata: {
      esportsTeamId: string;
      participantMetadata: {
        participantId: number;
        esportsPlayerId: string;
        summonerName: string;
        championId: string;
        role: string;
      }[];
    };
  };
  frames: {
    rfc460Timestamp: string;
    gameState: string;
    blueTeam: {
      totalGold: number;
      inhibitors: number;
      towers: number;
      barons: number;
      totalKills: number;
      dragons: string[];
      participants: {
        participantId: number;
        totalGold: number;
        level: number;
        kills: number;
        deaths: number;
        assists: number;
        creepScore: number;
        currentHealth: number;
        maxHealth: number;
      }[];
    };
    redTeam: {
      totalGold: number;
      inhibitors: number;
      towers: number;
      barons: number;
      totalKills: number;
      dragons: string[];
      participants: {
        participantId: number;
        totalGold: number;
        level: number;
        kills: number;
        deaths: number;
        assists: number;
        creepScore: number;
        currentHealth: number;
        maxHealth: number;
      }[];
    };
  }[];
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

  async getSchedule(options?: { leagueId?: string; pageToken?: string }): Promise<any> {
    try {
      let url = `${this.baseUrl}/getSchedule?hl=en-US`;
      
      if (options?.leagueId) {
        url += `&leagueId=${options.leagueId}`;
      }
      
      if (options?.pageToken) {
        url += `&pageToken=${options.pageToken}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data.data.schedule || { events: [] };
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }

  async getLiveMatches(): Promise<LiveEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getLive?hl=en-US`, {
        method: 'GET',
        headers: this.headers,
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data.data.schedule.events || [];
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }

async getLiveMatchStats(gameId: string): Promise<LiveStatsResponse | WindowStatsResponse> {
  try {
    // Use current time as the starting time to get the most recent data
    const currentTime = new Date().toISOString();
    
    // Try the window endpoint first (more comprehensive and useful data)
    const response = await fetch(`https://feed.lolesports.com/livestats/v1/window/${gameId}?startingTime=${currentTime}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching live stats for game ${gameId}:`, error);
    throw error;
  }
}
async getLiveMatchWindowStats(gameId: string, startingTime?: string): Promise<WindowStatsResponse | null> {
  try {
    // Start with current time
    const currentTime = new Date();
    
    // Subtract 30 seconds to ensure we're outside the restricted window
    const adjustedTime = new Date(currentTime.getTime() - 30000);
    
    // Round down seconds to the nearest multiple of 10
    adjustedTime.setSeconds(Math.floor(adjustedTime.getSeconds() / 10) * 10);
    adjustedTime.setMilliseconds(0);
    
    const formattedTime = adjustedTime.toISOString();
    console.log('Making API request with correctly formatted time:', formattedTime);
    const url = `https://feed.lolesports.com/livestats/v1/window/${gameId}?startingTime=${formattedTime}`;
    
    console.log(`Fetching stats for game ${gameId} with URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    
    if (!response.ok) {
      // Get the raw response text for better debugging
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      // Check for specific error conditions
      if (response.status === 404) {
        console.log(`Stats not available for game ${gameId}`);
        return null;
      }
      
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    // Check if the response is empty
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.error('Empty response received from API');
      return null;
    }
    
    // Parse the JSON after confirming we have content
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error fetching live window stats for game ${gameId}:`, error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
    } else {
      console.error('Error type: Unknown error');
    }
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

export function isWindowStatsResponse(response: any): response is WindowStatsResponse {
  return response && 
         response.gameMetadata && 
         response.frames && 
         response.frames.length > 0 && 
         response.frames[0].blueTeam !== undefined;
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

export function useLeagueSchedule(leagueId: string, pageToken?: string) {
  const [schedule, setSchedule] = useState<any>({ events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ older?: string; newer?: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getSchedule({ 
          leagueId, 
          pageToken 
        });
        
        setSchedule(data);
        setPagination(data.pages || {});
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
  }, [leagueId, pageToken]);

  return { schedule, loading, error, pagination };
}

export function useLiveMatches() {
  const [liveMatches, setLiveMatches] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await lolEsportsClient.getLiveMatches();
        setLiveMatches(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up a refresh interval for live matches (every 60 seconds)
    const intervalId = setInterval(fetchData, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { liveMatches, loading, error };
}

export function useLiveMatchStats(gameId: string) {
  const [stats, setStats] = useState<LiveStatsDetailsResponse | WindowStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get current time
        const currentTime = new Date().toISOString();
        
        // Use the new method from the client instance
        const data = await lolEsportsClient.getLiveMatchWindowStats(gameId, currentTime);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchData();
      
      // Set up a refresh interval (every 10 seconds)
      const intervalId = setInterval(fetchData, 10000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [gameId]);

  return { stats, loading, error };
}