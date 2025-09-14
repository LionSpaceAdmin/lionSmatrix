// Intelligence data types
export interface IntelligenceData {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  timestamp: string;
  verified: boolean;
  confidence: number;
  tags: string[];
  related: string[];
  evidence: Evidence[];
  analysis: Analysis;
}

// Additional types that were missing
export interface DeepDive {
  id: string;
  title: string;
  content: string;
  sources: string[];
  lastUpdated: string;
  prompt?: string;
  report?: string;
}

export interface NetworkConnection {
  id: string;
  source: string;
  target: string;
  type: 'communication' | 'financial' | 'social' | 'operational';
  strength: number;
  verified: boolean;
}

export interface IntelligencePanelData {
  id: string;
  title: string;
  data: any;
  lastUpdated: string;
}

export interface OSINTActor {
  id: string;
  name: string;
  type: 'individual' | 'organization' | 'group';
  aliases: string[];
  description: string;
  lastSeen: string;
}

export interface TranslationStrings {
  [key: string]: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export interface Evidence {
  id: string;
  type: 'document' | 'link' | 'image' | 'video' | 'social';
  title: string;
  source: string;
  url?: string;
  date: string;
  author?: string;
  verified: boolean;
  confidence: number;
  tags?: string[];
  description?: string;
}

export interface Analysis {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  riskAssessment: RiskAssessment;
  timeline: TimelineEvent[];
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  mitigation: string[];
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

// Mock data export
export const INTELLIGENCE_DATA: IntelligenceData[] = [
  {
    id: 'intel-001',
    title: 'Coordinated Bot Network Targets Election Integrity',
    description: 'Large-scale bot operation spreading false claims about voting systems detected across multiple platforms.',
    category: 'Elections',
    severity: 'critical',
    source: 'Lions of Zion Intelligence',
    timestamp: new Date().toISOString(),
    verified: true,
    confidence: 89,
    tags: ['Elections', 'Bots', 'Democracy'],
    related: ['intel-002', 'intel-003'],
    evidence: [],
    analysis: {
      summary: 'Coordinated disinformation campaign targeting electoral processes',
      keyFindings: ['Bot network of 10,000+ accounts', 'Cross-platform coordination', 'Targeting swing states'],
      recommendations: ['Monitor bot activity', 'Report to platforms', 'Educate voters'],
      riskAssessment: {
        level: 'critical',
        factors: ['High reach', 'Election timing', 'Vulnerable populations'],
        mitigation: ['Platform cooperation', 'Fact-checking', 'Public awareness']
      },
      timeline: []
    }
  }
];
