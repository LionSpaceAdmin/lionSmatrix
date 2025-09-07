'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, ChevronDown, Eye, Code, FileText } from 'lucide-react';

interface ComponentInfo {
  name: string;
  path: string;
  type: 'page' | 'component' | 'layout';
  children?: ComponentInfo[];
}

// Component tree structure based on the project
const componentTree: ComponentInfo[] = [
  {
    name: 'App Router Pages',
    path: '/src/app',
    type: 'layout',
    children: [
      {
        name: 'Home Page',
        path: '/src/app/page.tsx',
        type: 'page'
      },
      {
        name: 'Dashboard Page',
        path: '/src/app/(dashboard)/dashboard/page.tsx',
        type: 'page'
      },
      {
        name: 'War Room Page',
        path: '/src/app/(dashboard)/war-room/page.tsx',
        type: 'page'
      },
      {
        name: 'Join Page',
        path: '/src/app/(auth)/join/page.tsx',
        type: 'page'
      },
      {
        name: 'Intelligence Hub',
        path: '/src/app/intelligence/page.tsx',
        type: 'page'
      },
    ]
  },
  {
    name: 'Terminal Components',
    path: '/src/app/_components/terminal',
    type: 'component',
    children: [
      {
        name: 'CommandTerminal',
        path: '/src/app/_components/terminal/command-terminal.tsx',
        type: 'component'
      },
      {
        name: 'DataStreamDisplay',
        path: '/src/app/_components/terminal/data-stream-display.tsx',
        type: 'component'
      },
      {
        name: 'StatusIndicator',
        path: '/src/app/_components/terminal/status-indicator.tsx',
        type: 'component'
      },
      {
        name: 'IntelligenceCard',
        path: '/src/app/_components/terminal/intelligence-card.tsx',
        type: 'component'
      }
    ]
  },
  {
    name: 'Visual Components',
    path: '/src/app/_components/visuals',
    type: 'component',
    children: [
      {
        name: 'LivingIntelligenceCanvas',
        path: '/src/app/_components/visuals/living-intelligence-canvas.tsx',
        type: 'component'
      },
      {
        name: 'NeuralNetworkCanvas',
        path: '/src/app/_components/visuals/NeuralNetworkCanvas.tsx',
        type: 'component'
      },
      {
        name: 'MatrixBackground',
        path: '/src/app/_components/visuals/MatrixBackground.tsx',
        type: 'component'
      },
      {
        name: 'IntelligencePanel',
        path: '/src/app/_components/visuals/IntelligencePanel.tsx',
        type: 'component'
      }
    ]
  },
  {
    name: 'Shared Components',
    path: '/src/app/_components/shared',
    type: 'component',
    children: [
      {
        name: 'NarrativeCard',
        path: '/src/app/_components/shared/narrativecard.tsx',
        type: 'component'
      },
      {
        name: 'ActionGrid',
        path: '/src/app/_components/shared/actiongrid.tsx',
        type: 'component'
      },
      {
        name: 'AlertBanner',
        path: '/src/app/_components/shared/alertbanner.tsx',
        type: 'component'
      }
    ]
  },
  {
    name: 'Intelligence Components',
    path: '/src/app/intelligence/_components',
    type: 'component',
    children: [
      {
        name: 'ThreatAnalysis',
        path: '/src/app/intelligence/_components/threat-analysis.tsx',
        type: 'component'
      },
      {
        name: 'CampaignGenerator',
        path: '/src/app/intelligence/_components/campaign-generator.tsx',
        type: 'component'
      },
      {
        name: 'AnalyticsDashboard',
        path: '/src/app/intelligence/_components/analytics-dashboard.tsx',
        type: 'component'
      },
      {
        name: 'OSINTArchive',
        path: '/src/app/intelligence/_components/osint-archive.tsx',
        type: 'component'
      }
    ]
  },
  {
    name: 'UI Components',
    path: '/src/components/ui',
    type: 'component',
    children: [
      {
        name: 'Grid',
        path: '/src/components/ui/grid.tsx',
        type: 'component'
      },
      {
        name: 'Tabs',
        path: '/src/components/ui/tabs.tsx',
        type: 'component'
      }
    ]
  }
];

interface TreeNodeProps {
  node: ComponentInfo;
  onSelect: (component: ComponentInfo) => void;
  selectedPath?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onSelect, selectedPath }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedPath === node.path;

  const getTypeIcon = (type: ComponentInfo['type']) => {
    switch (type) {
      case 'page':
        return <FileText className="w-4 h-4 text-terminal-cyan" />;
      case 'component':
        return <Code className="w-4 h-4 text-terminal-gold" />;
      case 'layout':
        return <Eye className="w-4 h-4 text-terminal-text" />;
      default:
        return null;
    }
  };

  return (
    <div className="font-mono text-sm">
      <div 
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-terminal-line/50 transition-colors ${
          isSelected ? 'bg-terminal-cyan/20 border-l-2 border-terminal-cyan' : ''
        }`}
        onClick={() => {
          if (hasChildren) {
            setExpanded(!expanded);
          }
          onSelect(node);
        }}
      >
        {hasChildren && (
          expanded ? 
            <ChevronDown className="w-4 h-4 text-terminal-muted" /> : 
            <ChevronRight className="w-4 h-4 text-terminal-muted" />
        )}
        {!hasChildren && <div className="w-4" />}
        {getTypeIcon(node.type)}
        <span className={`flex-1 ${isSelected ? 'text-terminal-cyan font-bold' : 'text-terminal-text'}`}>
          {node.name}
        </span>
        <span className="text-xs text-terminal-muted">
          {node.type.toUpperCase()}
        </span>
      </div>
      
      {hasChildren && expanded && (
        <div className="ml-4 border-l border-terminal-line/30 pl-2">
          {node.children?.map((child, index) => (
            <TreeNode 
              key={index} 
              node={child} 
              onSelect={onSelect} 
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ComponentInspector: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Filter components based on search term
  const filterComponents = (components: ComponentInfo[], term: string): ComponentInfo[] => {
    if (!term) return components;
    
    return components.map(comp => {
      const matchesName = comp.name.toLowerCase().includes(term.toLowerCase());
      const matchesPath = comp.path.toLowerCase().includes(term.toLowerCase());
      
      if (comp.children) {
        const filteredChildren = filterComponents(comp.children, term);
        if (matchesName || matchesPath || filteredChildren.length > 0) {
          return { ...comp, children: filteredChildren };
        }
        return null;
      }
      
      return (matchesName || matchesPath) ? comp : null;
    }).filter(Boolean) as ComponentInfo[];
  };

  const filteredTree = filterComponents(componentTree, searchTerm);

  const handleComponentSelect = (component: ComponentInfo) => {
    setSelectedComponent(component);
  };

  const navigateToComponent = (path: string) => {
    // Convert file path to URL path for pages
    if (path.includes('/page.tsx')) {
      let route = path.replace('/src/app', '').replace('/page.tsx', '');
      route = route.replace(/\/\([^)]+\)/g, ''); // Remove route groups
      if (route === '') route = '/';
      window.open(`http://localhost:3000${route}`, '_blank');
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-terminal-secondary/95 backdrop-blur-sm border border-terminal-border rounded-lg p-3 shadow-terminal hover:bg-terminal-line/50 transition-colors"
        >
          <Code className="w-5 h-5 text-terminal-cyan" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[80vh] bg-terminal-secondary/95 backdrop-blur-sm border border-terminal-border rounded-lg shadow-terminal z-50 font-terminal">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-terminal-border">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-terminal-cyan" />
          <h3 className="text-sm font-bold text-terminal-text uppercase">Component Inspector</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-terminal-muted hover:text-terminal-cyan transition-colors"
          >
            ─
          </button>
          <button className="text-terminal-muted hover:text-terminal-red transition-colors">
            ×
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-terminal-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-terminal-bg border border-terminal-line rounded text-sm text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-terminal-cyan"
          />
        </div>
      </div>

      {/* Component Tree */}
      <div className="max-h-64 overflow-y-auto p-2">
        {filteredTree.map((node, index) => (
          <TreeNode 
            key={index} 
            node={node} 
            onSelect={handleComponentSelect}
            selectedPath={selectedComponent?.path}
          />
        ))}
      </div>

      {/* Component Details */}
      {selectedComponent && (
        <div className="border-t border-terminal-border p-4">
          <h4 className="text-sm font-bold text-terminal-cyan mb-2">
            {selectedComponent.name}
          </h4>
          <p className="text-xs text-terminal-muted mb-2">
            {selectedComponent.path}
          </p>
          <div className="flex gap-2">
            {selectedComponent.type === 'page' && (
              <button
                onClick={() => navigateToComponent(selectedComponent.path)}
                className="px-3 py-1 text-xs bg-terminal-cyan text-terminal-bg rounded hover:bg-terminal-cyan/80 transition-colors font-bold uppercase"
              >
                Open Page
              </button>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedComponent.path);
              }}
              className="px-3 py-1 text-xs bg-terminal-line text-terminal-text rounded hover:bg-terminal-line/80 transition-colors font-bold uppercase"
            >
              Copy Path
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="border-t border-terminal-border p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-terminal-muted">PAGES</div>
            <div className="text-sm font-bold text-terminal-cyan">5</div>
          </div>
          <div>
            <div className="text-xs text-terminal-muted">COMPONENTS</div>
            <div className="text-sm font-bold text-terminal-gold">15+</div>
          </div>
          <div>
            <div className="text-xs text-terminal-muted">SERVER</div>
            <div className="text-sm font-bold text-terminal-text">ONLINE</div>
          </div>
        </div>
      </div>
    </div>
  );
};