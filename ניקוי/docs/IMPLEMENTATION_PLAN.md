# 🎯 Implementation Plan - LionSpace V3 Structure

## Phase 1: Cleanup (נקוי)
### 1.1 Remove unnecessary directories in (dashboard)
- [ ] Remove cognitive-warfare (duplicate functionality)
- [ ] Remove matrix (moved to war-room)
- [ ] Remove platform (unclear purpose)

### 1.2 Move misplaced directories
- [ ] Move _components content to components/
- [ ] Move _contexts content to contexts/

## Phase 2: Create Missing Structure (יצירת מבנה חסר)

### 2.1 Complete route groups
#### (academy)
- [ ] Create layout.tsx
- [ ] Create page.tsx (Knowledge base home)
- [ ] Create /courses/page.tsx
- [ ] Create /playbooks/page.tsx
- [ ] Create /tutorials/page.tsx

#### (enterprise)
- [ ] Create layout.tsx
- [ ] Create page.tsx (Enterprise dashboard)
- [ ] Create /organization/page.tsx
- [ ] Create /threats/page.tsx
- [ ] Create /compliance/page.tsx
- [ ] Create /alerts/page.tsx

#### (trust)
- [ ] Create layout.tsx
- [ ] Create page.tsx (Transparency hub)
- [ ] Create /privacy/page.tsx
- [ ] Create /provenance/page.tsx
- [ ] Create /audit/page.tsx

### 2.2 Complete components structure
#### components/ai/
- [ ] ThreatAnalyzer.tsx
- [ ] NetworkVisualizer.tsx
- [ ] DeepfakeDetector.tsx
- [ ] NarrativeTracker.tsx
- [ ] EarlyWarningWidget.tsx
- [ ] AdversarySimConsole.tsx
- [ ] ProvenanceBadge.tsx
- [ ] PrebunkingKitBuilder.tsx

#### components/social/
- [ ] SocialComposer.tsx
- [ ] PlatformRouter.tsx
- [ ] PublishQueue.tsx
- [ ] EngagementTracker.tsx

#### components/mission/
- [ ] MissionCard.tsx
- [ ] MissionProgress.tsx
- [ ] MissionRewards.tsx

#### components/shared/
- [ ] Move shadcn/ui components here
- [ ] Create common primitives

### 2.3 Complete lib structure
#### lib/ai/
- [ ] gpt-adapter.ts
- [ ] claude-adapter.ts
- [ ] gemini-adapter.ts
- [ ] rag-pipeline.ts

#### lib/streaming/
- [ ] websocket-manager.ts
- [ ] sse-handler.ts
- [ ] backpressure.ts

#### lib/blockchain/
- [ ] ipfs-client.ts
- [ ] l2-hasher.ts
- [ ] verifier.ts

## Phase 3: Services & Packages Setup (הגדרת שירותים וחבילות)

### 3.1 Create service scaffolds
Each service needs:
- [ ] package.json
- [ ] Dockerfile
- [ ] src/index.ts
- [ ] README.md
- [ ] .env.example

### 3.2 Create package exports
Each package needs:
- [ ] Proper package.json with exports
- [ ] TypeScript config
- [ ] Build script
- [ ] Index barrel file

## Phase 4: Contracts & Infrastructure (חוזים ותשתית)

### 4.1 Complete contracts
- [ ] Add graphql/ directory
- [ ] Create base proto definitions
- [ ] Create OpenAPI specs for each service
- [ ] Create JSONSchema for events

### 4.2 Infrastructure templates
- [ ] Terraform modules for each service
- [ ] K8s manifests
- [ ] Monitoring dashboards
- [ ] Feature flag definitions

## Phase 5: Documentation (תיעוד)

### 5.1 Create developer guides
- [ ] ARCHITECTURE.md (detailed)
- [ ] CONTRIBUTING.md
- [ ] DEVELOPMENT.md
- [ ] DEPLOYMENT.md

### 5.2 Create agent instructions
- [ ] AI_AGENT_GUIDE.md
- [ ] COMPONENT_PATTERNS.md
- [ ] SERVICE_PATTERNS.md

## Phase 6: Validation (אימות)

### 6.1 Structure validation
- [ ] Run tree command and verify
- [ ] Check all imports work
- [ ] Verify no duplicates
- [ ] Test build process

### 6.2 Create validation script
- [ ] Write scripts/validate-structure.js
- [ ] Add to CI/CD pipeline

## 📊 Current Progress

### ✅ Completed
- Root monorepo structure
- Basic apps/packages/services directories
- Core configuration files

### 🔄 In Progress
- Route group completion
- Component structure
- Service scaffolds

### ❌ Not Started
- Detailed service implementations
- Contract definitions
- Infrastructure templates
- Documentation

## 🚨 Critical Path

1. **First:** Clean up duplicates and misplaced files
2. **Second:** Create missing route structures
3. **Third:** Set up component architecture
4. **Fourth:** Scaffold services and packages
5. **Fifth:** Documentation and validation

## 📝 Notes for Next Agent

- All placeholder files should have TODO comments
- Use consistent naming: kebab-case for files, PascalCase for components
- Every service should follow microservice patterns
- Maintain separation of concerns strictly
- Document every architectural decision
