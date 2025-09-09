// Types for Intelligence Platform
export interface OSINTActor {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
}

export interface DeepDive {
  prompt: string;
  report: string;
}

export interface AnalysisResult {
  input: string | null;
  output: string | null;
  type: string | null;
}

export interface EvidenceLogEntry {
  timestamp: string;
  type: string;
  summary: string;
  input: any;
  output: any;
  hash: string;
}

export interface Automation {
  id: number;
  trigger: string;
  action: string;
  actionText: string;
  schedule: string;
  scheduleText: string;
  status: 'active' | 'paused';
  lastRun: string;
  totalRuns: number;
  successRate: number;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface TranslationStrings {
  [key: string]: string;
}

export interface LanguageConfig {
  name: string;
  flag: string;
}

// Additional types for network connections and panel data
export interface NetworkConnection {
  [actor: string]: string[];
}

export interface IntelligencePanelActorData {
  name: string;
  alias: string;
  followers: string;
  platforms: string[];
  risk_level: string;
  keywords: string[];
  narratives: string[];
  network_connections: string[];
  activity_summary: string;
  last_activity: string;
  engagement_rate: string;
  content_frequency: string;
}

export interface IntelligencePanelData {
  [actor: string]: IntelligencePanelActorData;
}