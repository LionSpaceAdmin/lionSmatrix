# Migration Plan: LionSpace to ixartz/Next-js-Boilerplate

## Phase 1: Setup Template
- [ ] Clone ixartz/Next-js-Boilerplate
- [ ] Install dependencies
- [ ] Verify template works

## Phase 2: Migrate Components
- [ ] Copy `/src/app/components/visuals/intelligence-data.ts`
- [ ] Copy `/src/app/components/LandingSection.tsx`
- [ ] Migrate Three.js visualizations
- [ ] Transfer public assets

## Phase 3: Configuration
- [ ] Setup environment variables
- [ ] Configure Vercel deployment
- [ ] Setup database connection
- [ ] Configure Sentry monitoring

## Phase 4: Testing
- [ ] Run test suite
- [ ] Test all features
- [ ] Fix any issues

## Phase 5: Deployment
- [ ] Deploy to staging
- [ ] Verify all works
- [ ] Deploy to production

## Files to Migrate:
```
src/app/components/
├── visuals/
│   └── intelligence-data.ts
├── LandingSection.tsx
└── [other custom components]

public/
├── images/
└── assets/
```

## Environment Variables:
```env
GCP_PROJECT_ID=lionspace
VERCEL_PROJECT_ID=[your-id]
DATABASE_URL=[your-db]
NEXT_PUBLIC_SENTRY_DSN=[your-sentry]
```

## Success Criteria:
- [ ] DevContainer works
- [ ] No npm errors
- [ ] All tests pass
- [ ] Production ready
