# 🔧 Lions of Zion Services

This directory contains microservices and backend services for the Lions of Zion platform.

## 📁 Directory Structure

```
services/
├── auth/              # Authentication & Authorization Service
├── api/               # Core API Gateway & Services  
├── war-machine/       # War Machine Tools Backend
├── analytics/         # Analytics & Metrics Service
└── monitoring/        # Health checks & System monitoring
```

## 🛡️ Service Overview

### 🔐 **auth/**
- **Purpose**: User authentication, OAuth providers, session management
- **Technology**: Node.js/Express, JWT, OAuth 2.0
- **Features**: 
  - Google/Twitter OAuth
  - Magic link authentication  
  - RBAC (Role-Based Access Control)
  - Session management

### 🌐 **api/**
- **Purpose**: Core API gateway and business logic services
- **Technology**: Node.js/Fastify, GraphQL/REST
- **Features**:
  - Content management APIs
  - Narrative tracking APIs
  - Evidence collection APIs
  - User management APIs

### 🛡️ **war-machine/**
- **Purpose**: Backend for War Machine analysis tools
- **Technology**: Node.js/Python, AI/ML libraries
- **Features**:
  - Image Influence Lab backend
  - Fact-Check Window API
  - Report/Research system
  - Fake Resistance Tracker
  - Deep Research Daily

### 📊 **analytics/**
- **Purpose**: Analytics, metrics, and insights
- **Technology**: Node.js, ClickHouse/BigQuery
- **Features**:
  - Platform usage analytics
  - Content performance metrics
  - Threat detection analytics
  - User behavior insights

### 🔍 **monitoring/**
- **Purpose**: System health, monitoring, and alerting
- **Technology**: Prometheus, Grafana, Node.js
- **Features**:
  - Health check endpoints
  - Performance monitoring
  - Error tracking
  - Alert management

## 🚀 Development Setup

Each service contains its own:
- `package.json` - Dependencies and scripts
- `Dockerfile` - Container configuration  
- `docker-compose.yml` - Local development setup
- `README.md` - Service-specific documentation
- `.env.example` - Environment variables template

## 🔧 Common Commands

```bash
# Install all service dependencies
pnpm install

# Start all services in development
pnpm dev

# Build all services
pnpm build

# Run tests for all services
pnpm test

# Start specific service
pnpm dev --filter=auth

# Build specific service  
pnpm build --filter=war-machine
```

## 🌐 Service Communication

Services communicate via:
- **HTTP APIs** - REST/GraphQL endpoints
- **Message Queues** - Redis pub/sub for real-time events
- **Database** - Shared PostgreSQL for common data
- **Cache** - Redis for session and data caching

## 🔒 Security Considerations

- All services use HTTPS in production
- API authentication via JWT tokens
- Rate limiting on all public endpoints
- Input validation and sanitization
- Audit logging for all operations

## 📈 Scalability

- Each service can be scaled independently
- Horizontal scaling via Docker containers
- Load balancing with Nginx
- Database connection pooling
- Redis clustering for high availability

## 🚦 Service Status

| Service | Status | Health Check | Documentation |
|---------|--------|--------------|---------------|
| auth | 🚧 Planning | `/health` | [README](auth/README.md) |
| api | 🚧 Planning | `/health` | [README](api/README.md) |
| war-machine | 🚧 Planning | `/health` | [README](war-machine/README.md) |
| analytics | 🚧 Planning | `/health` | [README](analytics/README.md) |
| monitoring | 🚧 Planning | `/health` | [README](monitoring/README.md) |

## 🔄 CI/CD Pipeline

Each service includes:
- GitHub Actions workflows
- Automated testing
- Docker image building
- Security scanning
- Deployment to staging/production

---

*Lions of Zion - Defending Truth in the Information Age* 🦁