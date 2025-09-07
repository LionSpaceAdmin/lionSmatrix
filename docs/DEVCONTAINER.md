# DevContainer Setup Guide

## 🚀 Overview

This project includes a fully configured Development Container (DevContainer) for consistent development environment setup across all team members and CI/CD systems.

## ⚙️ Configuration

### Container Specifications
- **Base Image**: `mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye`
- **Node.js Version**: 20.x (LTS)
- **Host Requirements**: 
  - 4+ CPU cores
  - 8GB+ RAM  
  - 32GB+ storage

### 🔧 Included Features

#### Core Development Tools
- **Git**: Version control with GitHub CLI integration
- **Node.js 20**: Latest LTS with npm package manager
- **Google Cloud CLI**: For GCP integrations
- **Docker-in-Docker**: Container management capabilities

#### VS Code Extensions (Auto-installed)
- **Next.js & React**: Development helpers and snippets
- **TypeScript**: Enhanced TypeScript support
- **Tailwind CSS**: Styling and class name suggestions
- **ESLint & Prettier**: Code formatting and linting
- **GitHub Copilot**: AI-powered code assistance
- **Cloud Code**: Google Cloud development tools

### 🌐 Port Configuration

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Next.js App | Main application server |
| 3001 | Dev Tools | Next.js development tools |
| 9229 | Node Debug | Node.js debugging port |
| 9230 | Inspector | Node.js inspector |

## 🚀 Getting Started

### Prerequisites
- **Docker Desktop** or **Docker Engine**
- **VS Code** with **Dev Containers extension**
- **GitHub account** with repository access

### Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/LionSpaceAdmin/lionspace-nextjs-modern.git
   cd lionspace-nextjs-modern
   ```

2. **Open in DevContainer**
   - Open VS Code
   - Run command: `Dev Containers: Reopen in Container`
   - Wait for container build and setup (first time: ~5-10 minutes)

3. **Verify Setup**
   ```bash
   # Check Node.js version
   node --version  # Should show v20.x.x
   
   # Check npm and dependencies
   npm --version
   npm install
   
   # Verify build works
   npm run build
   
   # Start development server
   npm run dev
   ```

### 🔧 Environment Variables

The DevContainer automatically sets up these environment variables:

```bash
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
VERCEL_ENV=development
GCP_PROJECT_ID=lionspace
GCP_REGION=us-central1
```

## 🛠️ Development Workflow

### Starting Development
```bash
# Install dependencies (if not done automatically)
npm install

# Start development server with hot reload
npm run dev

# Open application
# http://localhost:3000
```

### Code Quality
```bash
# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint

# Build for production
npm run build
```

### Cloud Integration
```bash
# Verify Google Cloud CLI
gcloud version

# Check GitHub CLI
gh --version

# Verify Vercel CLI (if installed)
vercel --version
```

## 🐛 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check Docker daemon
docker info

# Rebuild container
# In VS Code: Dev Containers: Rebuild Container
```

#### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER /workspaces/lionspace-nextjs-modern

# Reset npm cache
npm cache clean --force
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Google Fonts Network Issues
The DevContainer is configured to work offline. If you encounter font loading issues:
- ✅ Already fixed: Using system fonts instead of Google Fonts
- Network restrictions in container environment handled gracefully

### Performance Optimization

#### Volume Mounts
The DevContainer uses named volumes for `node_modules` to improve performance:
```json
"mounts": [
  "source=${localWorkspaceFolderBasename}-node_modules,target=${containerWorkspaceFolder}/node_modules,type=volume"
]
```

#### File Watching
Polling is enabled for file watching in containerized environments:
```bash
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
```

## 🔐 Security

### Features Enabled
- ✅ Google Cloud CLI with project configuration
- ✅ GitHub CLI with authentication
- ✅ Environment variable isolation
- ✅ Container-level security policies

### Best Practices
- Never commit secrets to version control
- Use environment variables for sensitive data
- Keep DevContainer configuration updated
- Regular security updates via base image updates

## 📦 Extensions & Tools

### Pre-installed VS Code Extensions
- **Next.js Pack**: Complete Next.js development suite
- **ES7+ React/Redux/React-Native snippets**: React development helpers
- **Tailwind CSS IntelliSense**: Tailwind class name completion
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **GitLens**: Enhanced Git capabilities
- **GitHub Copilot**: AI pair programming
- **Error Lens**: Inline error highlighting
- **Auto Rename Tag**: HTML/JSX tag synchronization

### Additional Tools Available
```bash
# Package management
npm, npx

# Development servers
next dev, next build, next start

# Code quality
eslint, prettier, typescript

# Cloud tools
gcloud, gh, docker

# System utilities
curl, wget, git, ssh
```

## 🔄 Updates & Maintenance

### Updating DevContainer
1. Pull latest changes from repository
2. Run: `Dev Containers: Rebuild Container`
3. Verify all tools work correctly

### Updating Dependencies
```bash
# Update npm packages
npm update

# Update npm itself
npm install -g npm@latest

# Update global tools
npm install -g vercel@latest
```

### Base Image Updates
The DevContainer automatically uses the latest LTS Node.js image. For manual updates:
1. Update `.devcontainer/devcontainer.json`
2. Rebuild container
3. Test all functionality

## 📞 Support

### Internal Support
- Check existing GitHub issues
- Review project documentation
- Contact team leads for access issues

### Community Resources
- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)