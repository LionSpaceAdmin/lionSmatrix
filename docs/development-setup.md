# Development Environment Setup 🚀

This document explains how to set up and use the enhanced development environment with automatic browser opening.

## Quick Start

```bash
# Setup project and optionally start dev server
./scripts/setup.sh

# Or manually start development with auto browser opening
pnpm dev:auto
```

## Available Development Commands

### Basic Commands
- `pnpm dev` - Standard Next.js development server
- `pnpm build` - Build the project for production
- `pnpm start` - Start production server

### Enhanced Development Commands (with browser automation)
- `pnpm dev:auto` - **Recommended**: Smart development server with environment detection
- `pnpm dev:open` - Development server + browser opening (simple version)
- `pnpm storybook:open` - Storybook development + browser opening

## Environment Detection

The enhanced development commands automatically detect your environment:

### Local Development
- Automatically opens your default browser
- Works on macOS, Windows, and Linux
- Falls back gracefully if browser opening fails

### GitHub Codespaces
- Detects Codespaces environment
- Provides the correct forwarded URL
- Shows URL to copy/paste

### Gitpod
- Detects Gitpod workspace
- Provides the correct workspace URL
- Shows URL to copy/paste

### Docker/Container
- Uses HOST environment variable if set
- Provides appropriate container URL

## Browser Opening Features

- **Smart detection**: Automatically detects your development environment
- **Fallback support**: If auto-opening fails, provides the correct URL to copy
- **Multi-platform**: Works on macOS, Windows, and Linux
- **Container-aware**: Handles Docker, Codespaces, Gitpod automatically

## Troubleshooting

### Browser doesn't open automatically
1. Check if you're in a container environment (URL will be shown to copy)
2. Try running `pnpm dev:open` for the simple version
3. Manually visit the URL shown in the terminal

### Port conflicts
The server will try different ports if 3000 is busy. Check the terminal output for the actual port.

### Environment variables
Set these if needed:
- `PORT` - Custom port (default: 3000)
- `HOST` - Custom host (default: localhost)
- `BROWSER` - Custom browser command

## Development Workflow

1. **Initial setup**: Run `./scripts/setup.sh` once
2. **Daily development**: Use `pnpm dev:auto` 
3. **Storybook work**: Use `pnpm storybook:open`
4. **Testing**: Use `pnpm test` or `pnpm test:e2e`

## Advanced Usage

### Custom browser
```bash
BROWSER="google-chrome --incognito" pnpm dev:auto
```

### Custom port
```bash
PORT=8080 pnpm dev:auto
```

### Debug mode
```bash
DEBUG=1 pnpm dev:auto
```

---

*This enhanced development setup provides a seamless development experience across different environments while maintaining compatibility with standard Next.js workflows.*