# API Documentation

## 🔌 LionSpace V3 API Reference

Complete API documentation for all endpoints and services.

## Base URL

```
Production: https://api.lionspace.com/v1
Development: http://localhost:3000/api
```

## Authentication

All API requests require authentication using JWT tokens.

```http
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/register
Create new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "Jane Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_124",
      "email": "newuser@example.com",
      "name": "Jane Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Campaigns

#### GET /api/campaigns
List all campaigns.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by status (active|draft|completed)
- `search` (string): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "campaign_123",
      "name": "Operation Truth Shield",
      "status": "active",
      "description": "Counter-disinformation campaign",
      "createdAt": "2024-01-01T00:00:00Z",
      "metrics": {
        "reach": 150000,
        "engagement": 0.12,
        "effectiveness": 0.85
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### GET /api/campaigns/:id
Get campaign details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "campaign_123",
    "name": "Operation Truth Shield",
    "status": "active",
    "description": "Comprehensive counter-disinformation campaign",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z",
    "targetAudience": "General Public",
    "tags": ["disinformation", "social-media", "fact-checking"],
    "metrics": {
      "reach": 150000,
      "engagement": 0.12,
      "effectiveness": 0.85,
      "sentimentScore": 0.72
    },
    "activities": [
      {
        "id": "activity_1",
        "type": "content_published",
        "timestamp": "2024-01-02T10:00:00Z",
        "description": "Published fact-check article"
      }
    ]
  }
}
```

#### POST /api/campaigns
Create new campaign.

**Request:**
```json
{
  "name": "New Campaign",
  "description": "Campaign description",
  "startDate": "2024-02-01",
  "endDate": "2024-03-01",
  "targetAudience": "Young Adults",
  "objectives": ["awareness", "education"],
  "budget": 50000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "campaign_124",
    "name": "New Campaign",
    "status": "draft",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

#### PUT /api/campaigns/:id
Update campaign.

**Request:**
```json
{
  "name": "Updated Campaign Name",
  "status": "active"
}
```

#### DELETE /api/campaigns/:id
Delete campaign.

### Reports

#### GET /api/reports
List all reports.

**Query Parameters:**
- `type` (string): Report type (threat|campaign|intelligence)
- `status` (string): Status (draft|processing|completed)
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)

#### GET /api/reports/:id
Get report details.

#### POST /api/reports
Generate new report.

**Request:**
```json
{
  "title": "Monthly Threat Analysis",
  "type": "threat",
  "dateRange": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  },
  "format": "pdf",
  "includeSections": [
    "executive_summary",
    "threat_landscape",
    "recommendations"
  ]
}
```

#### GET /api/reports/:id/download
Download report file.

### Intelligence

#### POST /api/intelligence/analyze
Analyze content for threats.

**Request:**
```json
{
  "content": "Text to analyze for disinformation",
  "source": "social_media",
  "metadata": {
    "platform": "twitter",
    "author": "@username"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "threatLevel": "medium",
    "confidence": 0.78,
    "indicators": [
      {
        "type": "emotional_manipulation",
        "confidence": 0.85,
        "evidence": ["use of fear-based language"]
      },
      {
        "type": "false_claims",
        "confidence": 0.72,
        "evidence": ["unverified statistics"]
      }
    ],
    "recommendations": [
      "Fact-check statistical claims",
      "Provide context for emotional language"
    ]
  }
}
```

#### GET /api/intelligence/threats
Get current threat landscape.

**Response:**
```json
{
  "success": true,
  "data": {
    "overallThreatLevel": "high",
    "activeThreats": [
      {
        "id": "threat_001",
        "type": "coordinated_campaign",
        "severity": "high",
        "description": "Coordinated disinformation about elections",
        "firstDetected": "2024-01-10T00:00:00Z",
        "affectedPlatforms": ["twitter", "facebook", "telegram"]
      }
    ],
    "trends": {
      "increasingThreats": ["deepfakes", "ai_generated"],
      "decreasingThreats": ["spam", "phishing"]
    }
  }
}
```

### Analytics

#### GET /api/analytics/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCampaigns": 45,
      "activeCampaigns": 12,
      "totalReports": 234,
      "threatLevel": "medium"
    },
    "recentActivity": [
      {
        "type": "campaign_started",
        "timestamp": "2024-01-15T10:00:00Z",
        "description": "Started 'Truth Shield' campaign"
      }
    ],
    "metrics": {
      "reach": {
        "total": 1500000,
        "change": 0.15
      },
      "engagement": {
        "rate": 0.12,
        "change": 0.05
      }
    }
  }
}
```

## Error Responses

All errors follow consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|------------|
| `UNAUTHORIZED` | Missing or invalid authentication | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid input data | 400 |
| `RATE_LIMIT` | Too many requests | 429 |
| `SERVER_ERROR` | Internal server error | 500 |

## Rate Limiting

API requests are rate limited:

- **Authentication**: 5 requests per minute
- **Standard endpoints**: 100 requests per minute
- **Analytics**: 30 requests per minute
- **Report generation**: 10 requests per hour

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

Configure webhooks for real-time events:

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["campaign.created", "report.completed", "threat.detected"],
  "secret": "webhook_secret_key"
}
```

### Webhook Events

- `campaign.created` - New campaign created
- `campaign.updated` - Campaign updated
- `campaign.completed` - Campaign finished
- `report.completed` - Report generation complete
- `threat.detected` - New threat identified
- `threat.resolved` - Threat neutralized

## SDKs

### JavaScript/TypeScript

```bash
npm install @lionspace/sdk
```

```typescript
import { LionSpaceClient } from '@lionspace/sdk'

const client = new LionSpaceClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.lionspace.com/v1'
})

// Get campaigns
const campaigns = await client.campaigns.list()

// Analyze content
const analysis = await client.intelligence.analyze({
  content: 'Text to analyze'
})
```

## Postman Collection

Download our [Postman Collection](./lionspace-api.postman.json) for easy API testing.

## Support

For API support, contact:
- Email: api-support@lionspace.com
- Documentation: https://docs.lionspace.com
- Status Page: https://status.lionspace.com