"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'analytics', label: 'Analytics', href: '/dashboard/tools/analytics', i18nKey: 'tab_analytics' },
  { id: 'strategic-assessment', label: 'Strategic Assessment', href: '/dashboard/tools/strategic-assessment', i18nKey: 'tab_strategic_assessment' },
  { id: 'image-influence-lab', label: 'ImageGen Studio', href: '/dashboard/tools/image-influence-lab', i18nKey: 'tab_image_studio' },
  { id: 'fact-check', label: 'Fact-Check', href: '/dashboard/tools/fact-check', i18nKey: 'tab_fact_check' },
  { id: 'report-research', label: 'Report & Research', href: '/dashboard/tools/report-research', i18nKey: 'tab_report_research' },
  { id: 'fake-resistance-tracker', label: 'Fake Resistance Tracker', href: '/dashboard/tools/fake-resistance-tracker', i18nKey: 'tab_fake_resistance' },
  { id: 'deep-research-daily', label: 'Deep Research Daily', href: '/dashboard/tools/deep-research-daily', i18nKey: 'tab_deep_research' },
  { id: 'campaigns', label: 'Campaign Manager', href: '/dashboard/campaigns', i18nKey: 'tab_campaigns' },
  // NOTE: Other tabs from the original component are not yet implemented as pages.
  // They can be added here as their pages are built.
];

export default function AiTerminal() {
  const pathname = usePathname();

  return (
    <div id="ai-section" className="w-full relative z-10 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8 overflow-x-auto px-4 sm:px-6 lg:px-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  pathname === tab.href
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                )}
                data-i18n-key={tab.i18nKey}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}