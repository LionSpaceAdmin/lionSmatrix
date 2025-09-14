/**
 * Constants and Enums for LionSpace V3
 * Centralized configuration and constant values
 */

// Application Constants
export const APP_CONFIG = {
  NAME: 'LionSpace V3',
  VERSION: '3.0.0',
  API_VERSION: 'v1',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_LANGUAGES: ['en', 'he', 'ar', 'es', 'fr', 'de', 'ru', 'zh'] as const,
  DEFAULT_LANGUAGE: 'en',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

export const USER_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'narrative:create',
    'narrative:read',
    'narrative:update',
    'narrative:delete',
    'threat:create',
    'threat:read',
    'threat:update',
    'threat:delete',
    'campaign:create',
    'campaign:read',
    'campaign:update',
    'campaign:delete',
    'evidence:create',
    'evidence:read',
    'evidence:update',
    'evidence:delete',
    'analytics:read',
    'system:configure',
  ],
  [UserRole.ANALYST]: [
    'narrative:create',
    'narrative:read',
    'narrative:update',
    'threat:create',
    'threat:read',
    'threat:update',
    'campaign:create',
    'campaign:read',
    'campaign:update',
    'evidence:create',
    'evidence:read',
    'evidence:update',
    'analytics:read',
  ],
  [UserRole.VIEWER]: [
    'narrative:read',
    'threat:read',
    'campaign:read',
    'evidence:read',
    'analytics:read',
  ],
  [UserRole.GUEST]: [
    'narrative:read',
    'threat:read',
  ],
} as const;

// Threat Levels
export enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export const THREAT_LEVEL_COLORS = {
  [ThreatLevel.LOW]: '#10B981', // green
  [ThreatLevel.MEDIUM]: '#F59E0B', // yellow
  [ThreatLevel.HIGH]: '#F97316', // orange
  [ThreatLevel.CRITICAL]: '#DC2626', // red
} as const;

export const THREAT_LEVEL_SCORES = {
  [ThreatLevel.LOW]: 1,
  [ThreatLevel.MEDIUM]: 2,
  [ThreatLevel.HIGH]: 3,
  [ThreatLevel.CRITICAL]: 4,
} as const;

// Narrative Categories
export enum NarrativeCategory {
  DISINFORMATION = 'disinformation',
  PROPAGANDA = 'propaganda',
  CONSPIRACY = 'conspiracy',
  HATE_SPEECH = 'hate_speech',
  EXTREMISM = 'extremism',
  TERRORISM = 'terrorism',
  CYBERSECURITY = 'cybersecurity',
  ELECTION_INTERFERENCE = 'election_interference',
  SOCIAL_MANIPULATION = 'social_manipulation',
  ECONOMIC_WARFARE = 'economic_warfare',
}

// Evidence Types
export enum EvidenceType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LINK = 'link',
  SOCIAL_POST = 'social_post',
  AUDIO = 'audio',
  SCREENSHOT = 'screenshot',
  EMAIL = 'email',
  MESSAGE = 'message',
  CODE = 'code',
}

export const EVIDENCE_TYPE_ICONS = {
  [EvidenceType.IMAGE]: '🖼️',
  [EvidenceType.VIDEO]: '📹',
  [EvidenceType.DOCUMENT]: '📄',
  [EvidenceType.LINK]: '🔗',
  [EvidenceType.SOCIAL_POST]: '📱',
  [EvidenceType.AUDIO]: '🎵',
  [EvidenceType.SCREENSHOT]: '📸',
  [EvidenceType.EMAIL]: '📧',
  [EvidenceType.MESSAGE]: '💬',
  [EvidenceType.CODE]: '💻',
} as const;

// Campaign Status
export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const CAMPAIGN_STATUS_COLORS = {
  [CampaignStatus.DRAFT]: '#6B7280', // gray
  [CampaignStatus.ACTIVE]: '#10B981', // green
  [CampaignStatus.PAUSED]: '#F59E0B', // yellow
  [CampaignStatus.COMPLETED]: '#3B82F6', // blue
  [CampaignStatus.CANCELLED]: '#DC2626', // red
} as const;

// Notification Types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  THREAT_ALERT = 'threat_alert',
  CAMPAIGN_UPDATE = 'campaign_update',
  SYSTEM_MAINTENANCE = 'system_maintenance',
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  NARRATIVES: {
    LIST: '/narratives',
    CREATE: '/narratives',
    GET: (id: string) => `/narratives/${id}`,
    UPDATE: (id: string) => `/narratives/${id}`,
    DELETE: (id: string) => `/narratives/${id}`,
    SEARCH: '/narratives/search',
  },
  THREATS: {
    LIST: '/threats',
    CREATE: '/threats',
    GET: (id: string) => `/threats/${id}`,
    UPDATE: (id: string) => `/threats/${id}`,
    DELETE: (id: string) => `/threats/${id}`,
    INDICATORS: (id: string) => `/threats/${id}/indicators`,
  },
  CAMPAIGNS: {
    LIST: '/campaigns',
    CREATE: '/campaigns',
    GET: (id: string) => `/campaigns/${id}`,
    UPDATE: (id: string) => `/campaigns/${id}`,
    DELETE: (id: string) => `/campaigns/${id}`,
    METRICS: (id: string) => `/campaigns/${id}/metrics`,
  },
  EVIDENCE: {
    LIST: '/evidence',
    CREATE: '/evidence',
    GET: (id: string) => `/evidence/${id}`,
    UPDATE: (id: string) => `/evidence/${id}`,
    DELETE: (id: string) => `/evidence/${id}`,
    UPLOAD: '/evidence/upload',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    TRENDS: '/analytics/trends',
    REPORTS: '/analytics/reports',
    EXPORT: '/analytics/export',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    CREATE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  DEBOUNCE_DELAY: 300,
  SCROLL_THRESHOLD: 100,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const;

// Error Codes
export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // System
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // File Upload
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
}

// Supported File Types
export const SUPPORTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENTS: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  ISO_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  SHORT: 'MM/DD/YYYY',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  HASHTAG: /#[a-zA-Z0-9_]+/g,
  MENTION: /@[a-zA-Z0-9_]+/g,
} as const;
