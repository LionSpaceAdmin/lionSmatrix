/**
 * API Contracts for LionSpace V3
 * Defines the shape of API requests and responses
 */

// Base API Response Structure
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Pagination
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Contracts
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Narrative Contracts
export interface CreateNarrativeRequest {
  title: string;
  description: string;
  category: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  evidence?: string[];
}

export interface UpdateNarrativeRequest extends Partial<CreateNarrativeRequest> {
  id: string;
}

export interface GetNarrativesRequest extends PaginationRequest {
  category?: string;
  threatLevel?: string;
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Threat Contracts
export interface CreateThreatRequest {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  indicators: string[];
  mitigations?: string[];
}

export interface UpdateThreatRequest extends Partial<CreateThreatRequest> {
  id: string;
}

export interface GetThreatsRequest extends PaginationRequest {
  severity?: string;
  type?: string;
  search?: string;
}

// Campaign Contracts
export interface CreateCampaignRequest {
  name: string;
  description: string;
  objectives: string[];
  startDate: string;
  endDate?: string;
  budget?: number;
  tags?: string[];
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  id: string;
}

export interface GetCampaignsRequest extends PaginationRequest {
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Evidence Contracts
export interface CreateEvidenceRequest {
  title: string;
  description: string;
  type: 'image' | 'video' | 'document' | 'link' | 'social_post';
  url?: string;
  metadata?: Record<string, unknown>;
  narrativeId?: string;
  threatId?: string;
}

export interface UpdateEvidenceRequest extends Partial<CreateEvidenceRequest> {
  id: string;
}

export interface GetEvidenceRequest extends PaginationRequest {
  type?: string;
  narrativeId?: string;
  threatId?: string;
  search?: string;
}

// User Management Contracts
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'analyst' | 'viewer';
  department?: string;
}

export interface UpdateUserRequest extends Partial<Omit<CreateUserRequest, 'password'>> {
  id: string;
}

export interface GetUsersRequest extends PaginationRequest {
  role?: string;
  department?: string;
  search?: string;
  isActive?: boolean;
}

// Analytics Contracts
export interface GetAnalyticsRequest {
  dateFrom: string;
  dateTo: string;
  metrics?: string[];
  groupBy?: 'day' | 'week' | 'month';
}

export interface AnalyticsResponse {
  metrics: {
    [key: string]: number | string;
  };
  trends: {
    date: string;
    value: number;
  }[];
  comparisons?: {
    previous: number;
    change: number;
    changePercent: number;
  };
}

// File Upload Contracts
export interface FileUploadRequest {
  fileData: string | ArrayBuffer; // Base64 string or binary data
  filename: string;
  mimeType: string;
  type: 'evidence' | 'avatar' | 'document';
  metadata?: Record<string, unknown>;
}

export interface FileUploadResponse {
  fileId: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Notification Contracts
export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  targetUsers?: string[];
  targetRoles?: string[];
  expiresAt?: string;
}

export interface GetNotificationsRequest extends PaginationRequest {
  unreadOnly?: boolean;
  type?: string;
}
