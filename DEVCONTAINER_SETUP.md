# Dev Container Setup Instructions

## Prerequisites
1. **Install Docker Desktop** - Download from https://www.docker.com/products/docker-desktop/
2. **Install VS Code** - Download from https://code.visualstudio.com/
3. **Install Dev Containers Extension** - Search for "Dev Containers" in VS Code Extensions

## Setup Steps

### 1. Install Dev Containers Extension
- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search for "Dev Containers"
- Install "Dev Containers" by Microsoft

### 2. Open Project in Dev Container
- Open this project in VS Code
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Dev Containers: Reopen in Container"
- Select it and wait for the container to build

### 3. Automatic Setup
Once the container is built, it will automatically:
- Install all dependencies (`pnpm install`)
- Start the development server (`pnpm dev`)
- Open the browser preview on `http://localhost:3000`

## What's Configured

### Dev Container Features
- **Node.js 22** with pnpm package manager
- **Docker-in-Docker** support
- **Git** integration
- **Auto port forwarding** (3000, 3001, 3002)
- **Auto browser preview** when server starts

### VS Code Extensions (Auto-installed)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- React/Next.js snippets
- Auto Rename Tag

### Development Server
- **Port**: 3000
- **Host**: 0.0.0.0 (accessible from host)
- **Hot Reload**: Enabled
- **Turbo**: Enabled for faster builds

## Troubleshooting

### If container fails to build:
1. Make sure Docker Desktop is running
2. Check Docker logs: `docker logs lionspace-dev`
3. Rebuild container: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

### If browser doesn't open automatically:
1. Check if server is running: `ps aux | grep "next dev"`
2. Manually open: `Ctrl+Shift+P` → "Simple Browser" → `http://localhost:3000`

### If ports are not forwarded:
1. Check VS Code Ports panel
2. Manually forward port 3000
3. Restart VS Code

## Commands

### Start development server:
```bash
cd apps/web && pnpm dev
```

### Install dependencies:
```bash
pnpm install
```

### Build for production:
```bash
pnpm build
```

## Environment Variables
Create `.env.local` in `apps/web/` with:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## Success Indicators
- ✅ Container builds without errors
- ✅ Development server starts on port 3000
- ✅ Browser preview opens automatically
- ✅ Hot reload works when editing files
- ✅ All VS Code extensions are installed



