# 📋 Agent Implementation Guide

## 🎯 Your Mission
You are implementing features in the LionSpace V3 monorepo. The structure is complete and ready for feature development.

## 🏗️ Structure Overview

```
lionspace-v3/
├── apps/web/           # Main Next.js app - YOUR PRIMARY FOCUS
├── packages/@lionspace/ # Shared packages
├── services/           # Microservices
├── contracts/          # API contracts
└── infrastructure/     # DevOps
```

## 📍 Where to Work

### For UI Features:
- **Pages:** `apps/web/app/(group)/feature/page.tsx`
- **Components:** `apps/web/components/category/ComponentName.tsx`
- **Styles:** Use Tailwind classes with terminal theme
- **State:** Use React hooks in components

### For Business Logic:
- **Domain logic:** `packages/@lionspace/core/src/`
- **AI features:** `packages/@lionspace/ai/src/`
- **Social features:** `packages/@lionspace/social/src/`

### For Backend Services:
- **Service code:** `services/service-name/src/`
- **API contracts:** `contracts/openapi/service-name.yaml`
- **Proto definitions:** `contracts/proto/service-name.proto`

## 🎨 Design System

### Colors (CSS Variables):
```css
--terminal-bg: rgb(3 7 18)
--terminal-text: rgb(226 232 240)
--terminal-cyan: rgb(34 211 238)
--terminal-green: rgb(34 197 94)
--terminal-red: rgb(239 68 68)
--terminal-gold: rgb(251 191 36)
--terminal-muted: rgb(100 116 139)
```

### Component Classes:
```tsx
// Cards
<div className="terminal-card">

// Buttons
<button className="terminal-button">

// Text
<h1 className="text-terminal-cyan font-mono">

// Status indicators
<div className="status-online">
<div className="status-warning">
<div className="status-error">
```

## 📝 File Templates

### Page Component:
```tsx
'use client'

export default function FeaturePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-terminal-cyan">FEATURE NAME</h1>
        <p className="text-terminal-muted">Feature description</p>
      </header>
      
      {/* Content here */}
    </div>
  )
}
```

### Service:
```ts
// services/service-name/src/index.ts
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.get('/health', (req, res) => {
  res.json({ status: 'operational' })
})

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`)
})
```

### Package:
```ts
// packages/@lionspace/package-name/src/index.ts
export * from './types'
export * from './utils'
export * from './constants'

// Package logic here
```

## 🚦 Implementation Checklist

When implementing a feature:

1. **Plan:**
   - [ ] Read the architecture doc
   - [ ] Identify affected components
   - [ ] Check existing patterns

2. **Implement:**
   - [ ] Create/update page components
   - [ ] Add necessary UI components
   - [ ] Implement business logic in packages
   - [ ] Create API endpoints if needed

3. **Test:**
   - [ ] Manual testing in browser
   - [ ] Check responsive design
   - [ ] Verify data flow
   - [ ] Test error states

4. **Document:**
   - [ ] Add JSDoc comments
   - [ ] Update relevant README
   - [ ] Add TODO comments for future work

## 🔧 Common Commands

```bash
# Development
cd apps/web && pnpm dev        # Start web app
pnpm build                      # Build all packages
pnpm test                       # Run tests

# Add dependencies
pnpm add package-name --filter @lionspace/web
pnpm add package-name --filter @lionspace/core

# Create new component
mkdir -p apps/web/components/category
touch apps/web/components/category/ComponentName.tsx

# Create new service
mkdir -p services/new-service/src
cd services/new-service && pnpm init
```

## ⚠️ Important Rules

1. **Never create files outside the monorepo structure**
2. **Always use TypeScript (.ts/.tsx)**
3. **Follow the terminal/cyber theme**
4. **Keep components focused and reusable**
5. **Use semantic HTML**
6. **Implement proper error handling**
7. **Add loading states**
8. **Make it responsive**

## 📊 Current Priorities

Based on the architecture document:

1. **Social Hub** - Cross-platform publishing
2. **AI Analysis Pipeline** - Multi-modal analysis
3. **War Room** - Real-time dashboard
4. **Community Features** - Gamification
5. **Enterprise Portal** - B2B features

## 🎯 TODO Markers

Use these in your code:
```ts
// TODO: Implement feature
// FIXME: Known issue
// HACK: Temporary solution
// NOTE: Important information
// OPTIMIZE: Performance improvement needed
```

## 🔍 Finding Your Way

- **Route structure:** Check `apps/web/app/`
- **Components:** Browse `apps/web/components/`
- **Types:** Look in `packages/@lionspace/core/src/types/`
- **API contracts:** See `contracts/openapi/`
- **Config:** Check root `*.json` files

## 💡 Tips

1. **Start small** - Implement basic version first
2. **Use existing patterns** - Check similar components
3. **Ask for clarification** - When requirements unclear
4. **Test as you go** - Don't wait until the end
5. **Commit often** - Small, focused commits

## 🚀 Ready to Start?

1. Choose a feature from the backlog
2. Read its requirements
3. Plan your implementation
4. Start coding!
5. Test thoroughly
6. Document your work

Remember: The structure is ready. Focus on building great features!

---

**Questions?** Check:
- `ARCHITECTURE.md` - System design
- `IMPLEMENTATION_PLAN.md` - Development roadmap
- `README_STRUCTURE.md` - Directory guide
- `CLAUDE.md` - AI-specific instructions
