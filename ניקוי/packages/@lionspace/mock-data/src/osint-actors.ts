// OSINT Actors Data for Intelligence Archive

export interface OsintActor {
  id: string;
  name: string;
  alias: string;
  platforms: string[];
  followers: number;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  last_activity: string;
  keywords: string[];
  description: string;
}

export const osintActors: OsintActor[] = [
  {
    id: 'jackson-hinkle',
    name: 'Jackson Hinkle',
    alias: 'jacksonhinklle',
    platforms: ['X/Twitter', 'Telegram', 'YouTube'],
    followers: 2300000,
    risk_level: 'HIGH',
    last_activity: '2024-01-15T10:30:00Z',
    keywords: ['Disinfo', 'Propaganda', 'Amplification'],
    description: 'Primary amplifier of hostile narratives with massive reach'
  },
  {
    id: 'samidoun',
    name: 'Samidoun',
    alias: 'samidoun',
    platforms: ['Website', 'X/Twitter', 'Instagram', 'Telegram'],
    followers: 150000,
    risk_level: 'HIGH',
    last_activity: '2024-01-15T08:15:00Z',
    keywords: ['PFLP', 'Terrorism', 'BDS'],
    description: 'Designated terrorist organization with university chapters'
  },
  {
    id: 'max-blumenthal',
    name: 'Max Blumenthal',
    alias: 'MaxBlumenthal',
    platforms: ['X/Twitter', 'Grayzone Project'],
    followers: 380000,
    risk_level: 'HIGH',
    last_activity: '2024-01-15T12:45:00Z',
    keywords: ['Grayzone', 'RT', 'Propaganda'],
    description: 'Founder of Grayzone Project with authoritarian regime ties'
  },
  {
    id: 'quds-news',
    name: 'Quds News Network',
    alias: 'QudsNen',
    platforms: ['X/Twitter', 'Telegram', 'Instagram'],
    followers: 2100000,
    risk_level: 'HIGH',
    last_activity: '2024-01-15T14:20:00Z',
    keywords: ['Hamas', 'PIJ', 'Propaganda'],
    description: 'Suspected Hamas-affiliated media outlet'
  },
  {
    id: 'motaz-azaiza',
    name: 'Motaz Azaiza',
    alias: 'MotazAzaiza',
    platforms: ['Instagram', 'X/Twitter'],
    followers: 18000000,
    risk_level: 'LOW',
    last_activity: '2024-01-15T09:00:00Z',
    keywords: ['Photographer', 'Gaza', 'Documentation'],
    description: 'Photojournalist documenting humanitarian crisis'
  }
];

export function searchActors(query: string, actors: OsintActor[] = osintActors): OsintActor[] {
  if (!query.trim()) return actors;
  
  const searchTerm = query.toLowerCase();
  return actors.filter(actor => 
    actor.name.toLowerCase().includes(searchTerm) ||
    actor.alias.toLowerCase().includes(searchTerm) ||
    actor.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    actor.description.toLowerCase().includes(searchTerm)
  );
}

export function sortActors(actors: OsintActor[], sortBy: 'name' | 'followers' | 'risk' | 'activity'): OsintActor[] {
  return [...actors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'followers':
        return b.followers - a.followers;
      case 'risk':
        const riskOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return riskOrder[b.risk_level] - riskOrder[a.risk_level];
      case 'activity':
        return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
      default:
        return 0;
    }
  });
}