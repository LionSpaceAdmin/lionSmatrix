/**
 * Core enums for the LionSpace platform
 */

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Platform {
  TWITTER = 'Twitter',
  X = 'X',
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
  TELEGRAM = 'Telegram',
  DISCORD = 'Discord',
  REDDIT = 'Reddit',
  RUMBLE = 'Rumble',
  GAB = 'Gab',
  PARLER = 'Parler',
  TRUTH_SOCIAL = 'Truth Social'
}

export enum AutomationStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FAILED = 'failed',
  PENDING = 'pending'
}

export enum EvidenceType {
  SCREENSHOT = 'screenshot',
  VIDEO = 'video',
  DOCUMENT = 'document',
  LINK = 'link',
  ARCHIVE = 'archive',
  ANALYSIS = 'analysis'
}

export enum ThreatLevel {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum Language {
  EN = 'en',
  HE = 'he',
  AR = 'ar',
  FR = 'fr',
  DE = 'de',
  RU = 'ru',
  ES = 'es',
  ZH = 'zh'
}

export enum UserRole {
  VIEWER = 'viewer',
  ANALYST = 'analyst',
  OPERATOR = 'operator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum NarrativeType {
  PROPAGANDA = 'propaganda',
  DISINFORMATION = 'disinformation',
  MISINFORMATION = 'misinformation',
  MALINFORMATION = 'malinformation',
  CONSPIRACY = 'conspiracy',
  INCITEMENT = 'incitement'
}