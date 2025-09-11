# Lions of Zion Platform - Local Development Setup TODO

**Created**: 2025-09-11 05:39 IST  
**Status**: 🔴 IN PROGRESS  
**Overall Progress**: ▓░░░░░░░░░ 10%

## Priority 1: Critical Build Blockers (Must Fix First)

### TypeScript Compilation Errors [3 files, 45 errors]
- [ ] **Fix app/(trust)/privacy/page.tsx** - 15 TypeScript errors
  - Unterminated string literal at line 74
  - Multiple syntax errors with commas and colons
  - **File**: `/Users/danielions/Development/lionspace-platform/apps/web/app/(trust)/privacy/page.tsx`
  - **Command**: `cd apps/web && pnpm tsc --noEmit`
  
- [ ] **Fix components/hooks/useProgressiveEnhancement.ts** - 14 TypeScript errors
  - Type expected errors at lines 149, 154, 159, 162
  - Unterminated regular expression literals
  - **File**: `/Users/danielions/Development/lionspace-platform/apps/web/components/hooks/useProgressiveEnhancement.ts`
  
- [ ] **Fix lib/security/csrf.ts** - 16 TypeScript errors
  - Type expected errors starting at line 150
  - Multiple syntax errors with brackets and semicolons
  - **File**: `/Users/danielions/Development/lionspace-platform/apps/web/lib/security/csrf.ts`

### Services Package Setup Issues
- [ ] **Initialize auth service properly**
  - Missing src directory structure
  - Missing tsconfig.json
  - Missing eslint.config.js
  - **Directory**: `/Users/danielions/Development/lionspace-platform/services/auth/`
  - **Commands**: 
    ```bash
    cd services/auth
    mkdir -p src
    touch src/index.ts tsconfig.json eslint.config.js
    ```

- [ ] **Initialize war-machine service properly**
  - Missing src directory structure
  - Missing tsconfig.json
  - Missing eslint.config.js
  - **Directory**: `/Users/danielions/Development/lionspace-platform/services/war-machine/`
  - **Commands**:
    ```bash
    cd services/war-machine
    mkdir -p src
    touch src/index.ts tsconfig.json eslint.config.js
    ```

- [ ] **Fix TypeScript configuration for services**
  - Fix bundler option error in root tsconfig.json
  - Update module resolution to es2015 or later
  - **File**: `/Users/danielions/Development/lionspace-platform/tsconfig.json`

## Priority 2: Linting & Configuration Issues

### ESLint Configuration Updates
- [ ] **Update ESLint commands in service packages**
  - Remove deprecated --ext flag from package.json scripts
  - Update to modern ESLint 9 syntax
  - **Files**: 
    - `/Users/danielions/Development/lionspace-platform/services/auth/package.json`
    - `/Users/danielions/Development/lionspace-platform/services/war-machine/package.json`
  - **Change**: `"lint": "eslint src --ext .ts"` → `"lint": "eslint src"`

- [ ] **Install missing ESLint dependencies**
  - Install eslint-define-config if needed
  - **Command**: `pnpm add -D eslint-define-config -w`

- [ ] **Update Next.js lint configuration**
  - Migrate from deprecated `next lint` to ESLint CLI
  - **Command**: `cd apps/web && npx @next/codemod@canary next-lint-to-eslint-cli .`

## Priority 3: Next.js Configuration Updates

- [ ] **Fix Next.js experimental.turbo deprecation**
  - Move experimental.turbo to config.turbopack
  - **File**: `/Users/danielions/Development/lionspace-platform/apps/web/next.config.mjs`
  - **Command**: `cd apps/web && npx @next/codemod@latest next-experimental-turbo-to-turbopack .`

- [ ] **Fix NODE_ENV warning**
  - Ensure NODE_ENV is set correctly in .env.local
  - **File**: `/Users/danielions/Development/lionspace-platform/apps/web/.env.local`

## Priority 4: Dependency Installation

- [ ] **Install node_modules for services**
  - Run pnpm install in service directories
  - **Commands**:
    ```bash
    cd services/auth && pnpm install
    cd services/war-machine && pnpm install
    ```

- [ ] **Fix workspace lockfile issues**
  - Update pnpm-lock.yaml to include all workspaces
  - **Command**: `pnpm install --force`

## Priority 5: Verification & Testing

- [ ] **Run TypeScript type checking**
  - Verify all TypeScript errors are resolved
  - **Command**: `pnpm type-check`
  - **Success Criteria**: No TypeScript errors

- [ ] **Run ESLint**
  - Verify all linting issues are resolved
  - **Command**: `pnpm lint`
  - **Success Criteria**: No ESLint errors

- [ ] **Run build**
  - Verify project builds successfully
  - **Command**: `pnpm build`
  - **Success Criteria**: Build completes without errors

- [ ] **Run development server**
  - Verify dev server starts properly
  - **Command**: `pnpm dev`
  - **Success Criteria**: Server runs on http://localhost:3000

## Priority 6: Final Setup & Documentation

- [ ] **Clear all caches**
  - Clear Next.js cache
  - Clear Turbo cache
  - **Commands**:
    ```bash
    rm -rf apps/web/.next
    rm -rf .turbo
    pnpm clean
    ```

- [ ] **Run all tests**
  - Unit tests
  - E2E tests
  - Accessibility tests
  - **Command**: `pnpm test:all`
  - **Success Criteria**: All tests pass

- [ ] **Update development documentation**
  - Document any new setup steps
  - Update CLAUDE.md if needed
  - **Success Criteria**: Documentation reflects current setup

## Success Metrics

✅ **Ready for Local Development When:**
- [ ] All TypeScript errors resolved (0 errors)
- [ ] All ESLint errors resolved (0 errors)
- [ ] Build completes successfully
- [ ] Development server runs without errors
- [ ] All services properly initialized
- [ ] All tests pass
- [ ] Can access http://localhost:3000 without errors

## Related Files & Commands Reference

### Key Files to Monitor
- `/Users/danielions/Development/lionspace-platform/apps/web/app/(trust)/privacy/page.tsx`
- `/Users/danielions/Development/lionspace-platform/apps/web/components/hooks/useProgressiveEnhancement.ts`
- `/Users/danielions/Development/lionspace-platform/apps/web/lib/security/csrf.ts`
- `/Users/danielions/Development/lionspace-platform/tsconfig.json`
- `/Users/danielions/Development/lionspace-platform/apps/web/next.config.mjs`

### Quick Commands
```bash
# Check TypeScript errors
cd apps/web && pnpm tsc --noEmit

# Check build status
pnpm build

# Check lint status
pnpm lint

# Start dev server
pnpm dev

# Full reset and rebuild
pnpm clean && rm -rf node_modules && pnpm install && pnpm build
```

---

**Last Updated**: 2025-09-11 05:39 IST  
**Next Update**: After first priority tasks are completed