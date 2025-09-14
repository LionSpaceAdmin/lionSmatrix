'use client';

interface Tab {
  id: string;
  label: string;
  i18nKey: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'terminal' | 'minimal';
  className?: string;
}

/**
 * Tab navigation component with internationalization support
 */
export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  className = ''
}: TabNavigationProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'terminal':
        return {
          container: 'border-b border-[#00ff88] mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600',
          tab: 'text-sm py-3 px-4 border-b-2 border-transparent flex-shrink-0 transition-all duration-300 font-mono uppercase tracking-wider',
          active: 'bg-[#00ff88]/10 border-b-[#00ff88] text-[#00ff88] font-bold',
          inactive: 'text-gray-400 hover:text-[#B8FFF2] hover:bg-gray-800/30'
        };
      case 'minimal':
        return {
          container: 'flex space-x-1 mb-6 overflow-x-auto',
          tab: 'px-4 py-2 rounded-lg flex-shrink-0 transition-all duration-200 font-medium',
          active: 'bg-cyan-500/20 text-cyan-400',
          inactive: 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
        };
      default:
        return {
          container: 'flex border-b border-b-2 border-transparent mb-6 overflow-x-auto',
          tab: 'text-lg py-2 px-6 border-b-2 border-transparent flex-shrink-0 transition-all duration-200 font-mono',
          active: 'active bg-cyan-500/20 border-b-cyan-400 text-cyan-400',
          inactive: 'text-gray-400 hover:text-gray-200'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div 
      className={`${variantClasses.container} ${className}`}
      role="tablist"
      aria-label="Navigation tabs"
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-tab={tab.id}
          data-i18n-key={tab.i18nKey}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => {
            const currentIndex = tabs.findIndex(t => t.id === tab.id);
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
              e.preventDefault();
              const prevTab = tabs[currentIndex - 1];
              if (prevTab) {
                onTabChange(prevTab.id);
                setTimeout(() => {
                  const prevTabElement = document.querySelector(`[data-tab="${prevTab.id}"]`) as HTMLButtonElement;
                  prevTabElement?.focus();
                }, 0);
              }
            } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
              e.preventDefault();
              const nextTab = tabs[currentIndex + 1];
              if (nextTab) {
                onTabChange(nextTab.id);
                setTimeout(() => {
                  const nextTabElement = document.querySelector(`[data-tab="${nextTab.id}"]`) as HTMLButtonElement;
                  nextTabElement?.focus();
                }, 0);
              }
            } else if (e.key === 'Home') {
              e.preventDefault();
              const firstTab = tabs[0];
              if (firstTab) {
                onTabChange(firstTab.id);
                setTimeout(() => {
                  const firstTabElement = document.querySelector(`[data-tab="${firstTab.id}"]`) as HTMLButtonElement;
                  firstTabElement?.focus();
                }, 0);
              }
            } else if (e.key === 'End') {
              e.preventDefault();
              const lastTab = tabs[tabs.length - 1];
              if (lastTab) {
                onTabChange(lastTab.id);
                setTimeout(() => {
                  const lastTabElement = document.querySelector(`[data-tab="${lastTab.id}"]`) as HTMLButtonElement;
                  lastTabElement?.focus();
                }, 0);
              }
            }
          }}
          className={`${variantClasses.tab} ${
            activeTab === tab.id 
              ? variantClasses.active
              : variantClasses.inactive
          } focus:outline-none focus:ring-2 focus:ring-cyan-400/20`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Vertical tab navigation variant
 */
export function VerticalTabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = ''
}: TabNavigationProps) {
  return (
    <div 
      className={`flex flex-col space-y-1 w-48 ${className}`}
      role="tablist"
      aria-label="Vertical navigation tabs"
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-tab={tab.id}
          data-i18n-key={tab.i18nKey}
          onClick={() => onTabChange(tab.id)}
          className={`text-left px-4 py-3 rounded-lg transition-all duration-200 font-mono text-sm ${
            activeTab === tab.id 
              ? 'bg-[#00ff88]/20 border-l-4 border-[#00ff88] text-[#00ff88] font-bold' 
              : 'text-gray-400 hover:text-[#B8FFF2] hover:bg-gray-800/30'
          }`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Tab navigation with icons
 */
interface TabWithIcon extends Tab {
  icon?: React.ReactNode;
}

interface TabNavigationWithIconsProps {
  tabs: TabWithIcon[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showLabels?: boolean;
  variant?: 'default' | 'terminal';
  className?: string;
}

export function TabNavigationWithIcons({ 
  tabs, 
  activeTab, 
  onTabChange,
  showLabels = true,
  variant = 'default',
  className = ''
}: TabNavigationWithIconsProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'terminal':
        return {
          container: 'flex border-b border-[#00ff88] mb-6 overflow-x-auto',
          tab: 'flex items-center space-x-2 py-3 px-4 border-b-2 border-transparent flex-shrink-0 transition-all duration-300 font-mono',
          active: 'bg-[#00ff88]/10 border-b-[#00ff88] text-[#00ff88]',
          inactive: 'text-gray-400 hover:text-[#B8FFF2]'
        };
      default:
        return {
          container: 'flex border-b border-b-2 border-transparent mb-6 overflow-x-auto',
          tab: 'flex items-center space-x-2 text-lg py-2 px-6 border-b-2 border-transparent flex-shrink-0 transition-all duration-200 font-mono',
          active: 'active bg-cyan-500/20 border-b-cyan-400 text-cyan-400',
          inactive: 'text-gray-400 hover:text-gray-200'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div 
      className={`${variantClasses.container} ${className}`}
      role="tablist"
      aria-label="Navigation tabs with icons"
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-tab={tab.id}
          data-i18n-key={tab.i18nKey}
          onClick={() => onTabChange(tab.id)}
          className={`${variantClasses.tab} ${
            activeTab === tab.id 
              ? variantClasses.active
              : variantClasses.inactive
          }`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          type="button"
        >
          {tab.icon && (
            <span className="w-5 h-5 flex items-center justify-center">
              {tab.icon}
            </span>
          )}
          {showLabels && <span>{tab.label}</span>}
        </button>
      ))}
    </div>
  );
}

/**
 * Mobile-friendly tab navigation with dropdown for overflow
 */
export function ResponsiveTabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ''
}: TabNavigationProps) {
  return (
    <>
      {/* Desktop version */}
      <div className={`hidden md:flex border-b border-b-2 border-transparent mb-6 ${className}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tab={tab.id}
            data-i18n-key={tab.i18nKey}
            onClick={() => onTabChange(tab.id)}
            className={`text-lg py-2 px-6 border-b-2 border-transparent flex-shrink-0 transition-all duration-200 font-mono ${
              activeTab === tab.id 
                ? 'active bg-cyan-500/20 border-b-cyan-400 text-cyan-400' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile version - horizontal scroll */}
      <div className={`md:hidden flex border-b border-b-2 border-transparent mb-6 overflow-x-auto pb-2 ${className}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tab={tab.id}
            data-i18n-key={tab.i18nKey}
            onClick={() => onTabChange(tab.id)}
            className={`text-sm py-2 px-4 border-b-2 border-transparent flex-shrink-0 transition-all duration-200 font-mono whitespace-nowrap ${
              activeTab === tab.id 
                ? 'active bg-cyan-500/20 border-b-cyan-400 text-cyan-400' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}