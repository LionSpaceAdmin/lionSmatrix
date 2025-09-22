# Agent Configuration

## Environment Setup

This project requires Node.js, pnpm, and Next.js environment.

### Setup Script

Run the setup script to prepare the environment:

```bash
./scripts/setup.sh
```

### Manual Setup

If you need to set up manually:

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the project
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint code
pnpm lint
```

## Project Structure

- **Framework**: Next.js 15.5.3 with TypeScript
- **Package Manager**: pnpm
- **Testing**: Vitest with @testing-library/react
- **Linting**: ESLint with Next.js config
- **AI Integration**: Google Genkit for AI flows

## Key Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm typecheck` - TypeScript validation
- `pnpm lint` - Code linting

## Dependencies

All dependencies are managed through pnpm with a frozen lockfile for consistency.
