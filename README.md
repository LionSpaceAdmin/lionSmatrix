
# 🦁 LionSpace Enterprise Platform

> **סביבת פיתוח מתקדמת ומלאה עבור Next.js Enterprise עם Dev Container**

מבוסס על [Next.js Enterprise Boilerplate](https://blazity.com/open-source/nextjs-enterprise-boilerplate) עם שיפורים מתקדמים לפיתוח enterprise.

## 🚀 התחלה מהירה עם Dev Container

### אפשרות 1: VS Code Dev Container (מקומי)
```bash
# 1. פתח את הפרויקט ב-VS Code
code .

# 2. פתח Command Palette
Ctrl+Shift+P (או Cmd+Shift+P במק)

# 3. בחר "Dev Containers: Reopen in Container"

# 4. ⏳ חכה לbuilding (3-5 דקות בפעם הראשונה)

# 5. 🎉 מוכן! הקלד במסוף:
pnpm run dev
```

### אפשרות 2: GitHub Codespaces (ענן)
```bash
# 1. בגיטהב, לחץ על "Code" → "Codespaces" → "Create codespace"
# 2. ⏳ חכה שהcodespace יבנה
# 3. 🎉 מוכן! הכל מותקן אוטומטית
```

## 🛠️ מה כלול בסביבת הפיתוח?

### 💻 כלי פיתוח
- **Node.js 20** עם **pnpm 10.0.0**
- **Next.js 15.3.3** עם TypeScript מתקדם
- **Tailwind CSS v4** עם IntelliSense מלא
- **ESLint + Prettier** עם הגדרות enterprise
- **Storybook 8.6.12** לפיתוח components

### 🧪 כלי בדיקה
- **Vitest** - Unit & Integration Testing
- **Playwright** - E2E Testing עם browsers מותקנים
- **React Testing Library** - Component Testing
- **Jest DOM** - Testing utilities

### 🗄️ מסדי נתונים ו-cache
- **PostgreSQL 15** - מסד נתונים ראשי
- **Redis 7** - Cache ו-sessions
- **Drizzle ORM** - Type-safe database queries
- **pgAdmin** - ניהול מסד נתונים בממשק גרפי

### 🤖 AI וכלי פרודקטיביות
- **GitHub Copilot Pro** - סיוע AI לקוד
- **GitHub CLI** - פעולות Git מהטרמינל
- **Vercel CLI** - deploy וניהול
- **Docker in Docker** - ניהול containers

### 📦 25+ Extensions אוטומטיות
- GitHub Copilot + Chat
- TypeScript & Next.js Support  
- Tailwind CSS IntelliSense
- Playwright Test Runner
- PostgreSQL Support
- GitLens, Error Lens, Todo Tree
- ועוד...

## 🌐 שירותים זמינים

| Port | שירות | URL | תיאור |
|------|--------|-----|--------|
| 3000 | Next.js | http://localhost:3000 | האפליקציה הראשית |
| 6006 | Storybook | http://localhost:6006 | Component Library |
| 5432 | PostgreSQL | postgresql://postgres:postgres@localhost:5432/lionspace_dev | מסד נתונים |
| 6379 | Redis | redis://localhost:6379 | Cache |
| 5050 | pgAdmin | http://localhost:5050 | ניהול DB |
| 8025 | Mailhog | http://localhost:8025 | בדיקת emails |

## 🎮 פקודות מהירות

```bash
# פיתוח
dev          # pnpm run dev - הפעלת Next.js
build        # pnpm run build - בנייה לפרודקשן
test         # pnpm run test - הרצת בדיקות
lint         # pnpm run lint - בדיקת קוד
format       # pnpm run format - עיצוב קוד
sb           # pnpm run storybook - Storybook

# מסד נתונים
db-up        # הפעלת PostgreSQL + Redis
db-down      # כיבוי מסדי נתונים
tools-up     # הפעלת כלי ניהול (pgAdmin, Mailhog)

# Git
gc "message" # git commit -m "message"
gp           # git push
gl           # git pull
gs           # git status
ga           # git add .
```

## 📋 Troubleshooting

### Container לא בונה?
```bash
# נקה Docker cache
docker system prune -a --volumes

# בנה מחדש
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

### Dependencies לא מתעדכנים?
```bash
# בתוך הקונטיינר
pnpm install --frozen-lockfile
```

### Database לא מתחבר?
```bash
# בדוק שהservices רצים
docker-compose ps

# הפעל מחדש
db-down && db-up
```

## 📖 תיעוד מפורט

- 📋 [מדריך Dev Container מלא](.devcontainer/README.md)
- 🏗️ [מדריך פיתוח מקורי](https://docs.blazity.com)

## Integrated features מהתמפלייט המקורי

### Boilerplate
With this template you will get all the boilerplate features included:

* [Next.js 15](https://nextjs.org/) - Performance-optimized configuration using App Directory
* [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework for efficient UI development
* [ESlint 9](https://eslint.org/) and [Prettier](https://prettier.io/) - Code consistency and error prevention
* [Corepack](https://github.com/nodejs/corepack) & [pnpm](https://pnpm.io/) as the package manager - For project management without compromises 
* [Strict TypeScript](https://www.typescriptlang.org/) - Enhanced type safety with carefully crafted config and [ts-reset](https://github.com/total-typescript/ts-reset) library
* [GitHub Actions](https://github.com/features/actions) - Pre-configured workflows including bundle size and performance tracking
* Perfect Lighthouse score - Optimized performance metrics
* [Bundle analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Monitor and manage bundle size during development
* Testing suite - [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/react), and [Playwright](https://playwright.dev/) for comprehensive testing
* [Storybook](https://storybook.js.org/) - Component development and documentation
* Advanced testing - Smoke and acceptance testing capabilities
* [Conventional commits](https://www.conventionalcommits.org/) - Standardized commit history management
* [Observability](https://opentelemetry.io/) - Open Telemetry integration
* [Absolute imports](https://nextjs.org/docs/advanced-features/module-path-aliases) - Simplified import structure
* [Health checks](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) - Kubernetes-compatible monitoring
* [Radix UI](https://www.radix-ui.com/) - Headless components for customization
* [CVA](http://cva.style/) (Class Variance Authority) - Consistent design system creation
* [Renovate BOT](https://www.whitesourcesoftware.com/free-developer-tools/renovate) - Automated dependency and security updates
* [Patch-package](https://www.npmjs.com/package/patch-package) - External dependency fixes without compromises
* Component relationship tools - Graph for managing coupling and cohesion
* [Semantic Release](https://github.com/semantic-release/semantic-release) - Automated changelog generation
* [T3 Env](https://env.t3.gg/) - Streamlined environment variable management

### Infrastructure & deployments

#### Vercel

Easily deploy your Next.js app with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=github&utm_campaign=next-enterprise) by clicking the button below:

[![Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise)

#### Custom cloud infrastructure

**next-enterprise** offers dedicated infrastructure as code (IaC) solutions built with Terraform, designed specifically for deploying Next.js applications based on our extensive experience working with enterprise clients.

Learn more in our [documentation (docs.blazity.com)][docs] how to quickstart with the deployments using simple CLI.

#### Available cloud providers and theirs features:

* **AWS (Amazon Web Services)**
  * Automated provisioning of AWS infrastructure
  * Scalable & secure setup using:
     * VPC - Isolated network infrastructure
     * Elastic Container Service (ECS) - Container orchestration
     * Elastic Container Registry (ECR) - Container image storage
     * Application Load Balancer - Traffic distribution
     * S3 + CloudFront - Static asset delivery and caching
     * AWS WAF - Web Application Firewall protection
     * Redis Cluster - Caching
  * CI/CD ready - Continuous integration and deployment pipeline

*... more coming soon*

### Team & maintenance

**next-enterprise** is backed and maintained by [Blazity](https://blazity.com), providing up to date security features and integrated feature updates.

#### Active maintainers

- Igor Klepacki ([neg4n](https://github.com/neg4n)) - Open Source Software Developer
- Tomasz Czechowski ([tomaszczechowski](https://github.com/tomaszczechowski)) - Solutions Architect & DevOps
- Jakub Jabłoński ([jjablonski-it](https://github.com/jjablonski-it)) - Head of Integrations

#### All-time contributors
[bmstefanski](https://github.com/bmstefanski)

## License

MIT


[docs]: https://docs.blazity.com/next-enterprise/deployments/enterprise-cli
