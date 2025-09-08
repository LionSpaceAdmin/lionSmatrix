# LionSpace Intelligence Platform

<div align="center">
  <h1>🦁 LionSpace Intelligence</h1>
  <p><strong>Advanced Threat Analysis Platform with Matrix-Style Visualizations</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Demo-Live-success.svg)](https://v0-lion-space.vercel.app)
  [![QA Status](https://img.shields.io/badge/QA-Active-green.svg)](./scripts/qa-check.sh)
  [![Build Status](https://img.shields.io/badge/Build-Passing-green.svg)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue.svg)](#)
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)](https://nextjs.org/)
</div>

## 🌐 Live Deployment

🚀 **Production URL:** https://v0-lion-space.vercel.app

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📊 QA Status - יקא

Run comprehensive quality assurance checks:

```bash
# Full QA check
./scripts/qa-check.sh

# Individual checks
npm run typecheck    # TypeScript compilation
npm run lint         # ESLint analysis  
npm test            # Unit tests
npm run build       # Production build
```

## 🏗️ Architecture

**Frontend Stack:**
- **Next.js 15.5.2** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5.7.2** - Type safety and developer experience
- **Tailwind CSS 4.0** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions

**Key Features:**
- 🎨 **Matrix-style background** with real intelligence data
- 🔍 **Interactive threat analysis** with drill-down capabilities  
- 📊 **Real-time intelligence feeds** and data visualization
- 🎯 **Responsive design** - works on desktop and mobile
- ♿ **Accessibility-first** - WCAG compliant with ARIA support

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm 10.8.3+
- Port 3000 available for development server

### Setup
```bash
# Clone repository
git clone https://github.com/LionSpaceAdmin/lionspace-nextjs-modern.git
cd lionspace-nextjs-modern

# Install dependencies (takes ~33 seconds)
npm install

# Start development server  
npm run dev
```

### Quality Assurance
This project maintains high QA standards with comprehensive checks:

- ✅ **TypeScript** - Strict type checking enabled
- ✅ **ESLint** - Code quality and consistency 
- ✅ **Vitest** - Fast unit testing framework
- ✅ **Playwright** - End-to-end testing
- 🔄 **QA Script** - Automated quality checks

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Check TypeScript compilation |
| `npm run lint` | Run ESLint analysis |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `./scripts/qa-check.sh` | Complete QA status check |

## 🎨 Visual Features

### Matrix Background
- **Real Data Integration** - Uses intelligence data for matrix text
- **Performance Optimized** - 60fps animations with proper cleanup
- **Responsive Design** - Adapts to all screen sizes
- **Accessibility** - Screen reader compatible with ARIA labels

### Intelligence Dashboard
- **Interactive Panels** - Click to explore threat intelligence
- **Data Visualization** - Charts, graphs, and network diagrams
- **Real-time Updates** - Live intelligence feed integration
- **Export Capabilities** - Save analysis results

## 🔒 Security & Privacy

- 🔐 **No Sensitive Data** - Sample data only, no real intelligence
- 🛡️ **Security Headers** - Comprehensive protection enabled
- 🔍 **Regular Audits** - Automated dependency vulnerability scanning
- 📝 **Privacy Compliant** - No user tracking or data collection

## 📚 Project Structure

```
lionspace-nextjs-modern/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components  
│   ├── lib/              # Utilities and integrations
│   └── contexts/         # React context providers
├── tests/                 # Test suites
│   ├── unit/             # Unit tests
│   └── e2e/              # End-to-end tests
├── scripts/              # Development and QA scripts
├── ap/                   # Analysis and documentation
└── public/               # Static assets
```

## 🌟 Key Components

- **MatrixBackground** - Main visual effect with intelligence data
- **IntelligencePanel** - Interactive threat analysis interface
- **StatusIndicator** - Real-time system status display
- **UnifiedBackground** - Optimized background component system

## 🔧 Configuration

### Environment Variables
Create `.env.local` for development:
```bash
VERCEL_ENV=development
VERCEL_URL=localhost:3000
GCP_PROJECT_ID=lionspace
NEXT_PUBLIC_VERCEL_ENV=development
```

### Build Configuration
- **ESLint** - Configured with Next.js recommended rules
- **TypeScript** - Strict mode with comprehensive type checking
- **Tailwind** - Custom design system with terminal theme
- **Vercel** - Optimized for serverless deployment

## 📈 Performance

- ⚡ **Fast Builds** - ~8-13 seconds production builds
- 🎯 **Optimized Bundle** - Code splitting and lazy loading
- 📊 **Core Web Vitals** - Excellent performance scores
- 🔄 **Hot Reload** - Instant development feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run QA checks (`./scripts/qa-check.sh`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [LionSpace Intelligence Platform](https://lionspace-nextjs-modern.vercel.app)
- **Documentation**: [Complete Docs](./ap/docs/)
- **QA Reports**: [Quality Assurance](./ap/phase3_final_readiness_report.md)
- **Security**: [Security Policy](./SECURITY.md)

---

<div align="center">
  <p><strong>🦁 Lions of Zion</strong> - Advanced Intelligence Solutions</p>
  <p><em>Quality Assured • Performance Optimized • Security First</em></p>
</div>