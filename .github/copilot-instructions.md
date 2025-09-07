# LionSpace Intelligence Platform - GitHub Copilot Instructions

**CRITICAL**: Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview
LionSpace Intelligence is a Next.js 15.5.2 web application built with React 19, TypeScript, and Tailwind CSS 4.0. It's an advanced threat analysis platform featuring matrix-style visualizations, real-time intelligence feeds, and interactive data analysis tools.

## Working Effectively

### Prerequisites & Environment Setup
- Install Node.js 18+ and npm 10.8.3+
- Run the setup script: `bash scripts/setup-development-environment.sh`
- Ensure port 3000 is available for development server

### Bootstrap & Build Process
1. **Install Dependencies:**
   ```bash
   npm install
   ```
   - Takes ~33 seconds
   - May show peer dependency warnings (safe to ignore)
   - NEVER CANCEL - wait for completion

2. **Development Server:**
   ```bash
   npm run dev
   ```
   - Starts in ~1.3 seconds
   - Runs on http://localhost:3000
   - Hot reload enabled

3. **Type Checking:**
   ```bash
   npm run typecheck
   ```
   - Takes ~2-3 seconds
   - Must pass before committing

4. **Production Build:**
   ```bash
   npm run build
   ```
   - **CRITICAL NETWORK ISSUE**: Build fails in restricted networks due to Google Fonts dependency
   - **CRITICAL LINTING ISSUE**: Build fails due to ESLint errors in existing code
   - **WORKAROUNDS REQUIRED**:
     
     **For Google Fonts Issue**: Comment out Google Fonts import in `src/app/layout.tsx`:
     ```typescript
     // import { Inter } from 'next/font/google';
     // const inter = Inter({ subsets: ['latin'] });
     ```
     Replace `${inter.className}` with empty string in body className
     
     **For ESLint Issues**: Add to `next.config.ts`:
     ```typescript
     const nextConfig: NextConfig = {
       eslint: {
         ignoreDuringBuilds: true,
       },
       // ... rest of config
     };
     ```
   - With workarounds: takes ~13-17 seconds, NEVER CANCEL
   - Set timeout to 900+ seconds for build commands
   - **NOTE**: Fix ESLint issues properly in production - ignoring is temporary workaround

5. **Production Server:**
   ```bash
   npm run start
   ```
   - Requires successful build first
   - Starts in ~569ms
   - NEVER CANCEL - set timeout to 60+ seconds

### Code Quality
1. **Linting:**
   ```bash
   npm run lint
   ```
   - **CURRENT STATUS**: 45 problems (14 errors, 31 warnings)
   - Common issues: TypeScript `any` types, unused variables, require() imports
   - Fix critical errors before committing
   - Takes ~5-10 seconds

## Known Issues & Workarounds

### Google Fonts Network Connectivity
- **Problem**: `import { Inter } from 'next/font/google'` fails in restricted networks
- **Error**: `getaddrinfo ENOTFOUND fonts.googleapis.com`
- **Solution**: Comment out Google Fonts import and usage in `src/app/layout.tsx`
- **Alternative**: Use local font files or system fonts

### ESLint Configuration
- Next.js build includes ESLint by default
- To disable during build: Add `eslint: { ignoreDuringBuilds: true }` to `next.config.ts`
- **NOT RECOMMENDED** for production - fix linting issues instead

### Critical Production Readiness Issues
The `ap/critical_issues.md` file documents major blockers:
- No backend API endpoints (except health check)
- Zero test coverage
- No CI/CD pipeline
- No database persistence
- Security vulnerabilities

## Project Structure & Navigation

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/lib/` - Utilities, APIs, and integrations
- `scripts/` - Development and deployment scripts
- `.claude/` - AI agent configurations
- `ap/` - Analysis and documentation

### Important Files
- `src/app/layout.tsx` - Main layout (Google Fonts issue location)
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.mjs` - ESLint configuration
- `package.json` - Dependencies and scripts

### Critical Components
- `src/app/_components/visuals/MatrixBackground.tsx` - Main matrix visualization
- `src/lib/tailwindui/` - TailwindUI integration components
- `src/contexts/translation-context.tsx` - Internationalization

## Validation Requirements

### Visual Validation Protocol (MANDATORY)
Per CLAUDE.md requirements, EVERY UI change requires browser validation:

1. **Start Development Server:**
   ```bash
   npm run dev
   ```
   - Wait for "Ready in XXXXms" message
   - NEVER CANCEL

2. **Browser Validation:**
   - Navigate to http://localhost:3000
   - Test desktop view (1920x1080)
   - Test mobile view (375x667)
   - Check console for errors
   - Verify all interactive elements work
   - Take screenshots for validation

3. **Essential Test Scenarios:**
   - Load homepage - verify matrix background animation
   - Click "ENTER THE MATRIX" button - should navigate to /platform
   - Test dropdown and button interactions
   - Verify responsive layout on mobile
   - Check that intelligence feed updates work

### Manual Testing Workflow
```bash
# 1. Clean build and start
rm -rf .next
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Verify matrix animation loads
# 4. Test navigation buttons
# 5. Check mobile responsiveness
# 6. Validate console shows no critical errors
```

## Timing Expectations & Timeouts

### Command Timing (NEVER CANCEL)
- `npm install`: 30-60 seconds - set timeout to 300 seconds
- `npm run dev`: 1-3 seconds startup - set timeout to 60 seconds  
- `npm run build`: 10-20 seconds (with workarounds) - set timeout to 900 seconds
- `npm run typecheck`: 2-5 seconds - set timeout to 60 seconds
- `npm run lint`: 5-15 seconds - set timeout to 120 seconds

### Visual Validation Requirements
- Development server startup: Wait for "Ready" message
- Page load: Wait for matrix animation to initialize
- Browser navigation: Allow 3-5 seconds for transitions
- Screenshot capture: Mandatory for all UI changes

## Common Development Tasks

### Making Changes
1. Always run `npm run typecheck` after TypeScript changes
2. Use `npm run lint` to check code quality
3. Start dev server with `npm run dev` for live testing
4. **ALWAYS** perform visual validation before reporting completion

### Debugging Build Issues
1. Check for Google Fonts import errors in layout.tsx
2. Verify all TypeScript types are properly defined
3. Fix ESLint errors before building
4. Clear Next.js cache: `rm -rf .next` if needed

### Performance Optimization
- Application loads matrix data from CSV files
- Large datasets may cause initial load delays
- Console shows detailed logging of data loading progress
- Matrix animation initializes ~168 fallback words for performance

## Dependencies & Technology Stack

### Core Technologies
- **Framework**: Next.js 15.5.2 with App Router
- **React**: Version 19.0.0
- **TypeScript**: 5.7.2
- **Styling**: Tailwind CSS 4.0.0
- **UI Components**: Radix UI components
- **Animation**: Framer Motion 12.23.12
- **3D Graphics**: React Three Fiber/Drei

### Development Tools
- **Package Manager**: npm 10.8.3
- **Linting**: ESLint with Next.js config
- **Browser Testing**: Playwright 1.55.0
- **Build Tool**: Next.js with Turbopack

## Environment Configuration

### Required Environment Variables
Create `.env.local` (generated by setup script):
```bash
VERCEL_ENV=development
VERCEL_URL=localhost:3000
GCP_PROJECT_ID=lionspace
GCP_REGION=us-central1
NEXT_PUBLIC_VERCEL_ENV=development
```

### Network Considerations
- Application requires internet access for full functionality
- Google Fonts require external network access
- Some API endpoints return 404/500 errors (expected in development)
- Geolocation and external services may fail in sandboxed environments

## Security & Best Practices

### Security Headers
- Next.js config includes comprehensive security headers
- Content Security Policy configured
- HTTPS redirects enabled in production

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- React Hooks exhaustive deps checking
- No `any` types allowed (enforce proper typing)

## Troubleshooting Guide

### Build Failures
1. **Google Fonts Error**: Apply layout.tsx workaround
2. **Type Errors**: Run `npm run typecheck` to identify issues
3. **ESLint Errors**: Fix or temporarily disable for builds
4. **Network Timeouts**: Increase timeout values, never cancel

### Runtime Issues
1. **Matrix Not Loading**: Check console for data loading errors
2. **Navigation Broken**: Verify Next.js routing configuration
3. **Mobile Layout Issues**: Test responsive breakpoints
4. **Performance Problems**: Monitor console logs for data loading

### Development Server Issues
1. **Port 3000 Busy**: Kill existing processes or use different port
2. **Hot Reload Not Working**: Restart dev server
3. **Build Cache Issues**: Clear `.next` directory
4. **Network Connectivity**: Check for firewall/proxy issues

## Success Criteria
- ✅ Development server starts without errors
- ✅ Application loads with matrix animation
- ✅ Navigation works between pages
- ✅ Console shows data loading progress without critical errors
- ✅ Responsive design works on mobile
- ✅ Build completes successfully (with workarounds)
- ✅ TypeScript compilation passes
- ✅ Visual validation screenshots confirm functionality

**Remember**: This is a complex intelligence platform with extensive visualizations. Always allow sufficient time for data loading and animation initialization. The matrix background is a key feature - ensure it loads properly in all validation scenarios.