'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { 
  getSOVChartConfig, 
  getSentimentChartConfig, 
  getPlatformChartConfig, 
  getKeywordsChartConfig,
  getNetworkActivityChartConfig,
  getThreatLevelChartConfig,
  getActivityTimeSeriesConfig 
} from '@/lib/data/chart-configs';
import { useI18n } from '@/lib/hooks/use-i18n';

Chart.register(...registerables);

export function AnalyticsDashboard() {
  const chartsRef = useRef<Record<string, Chart>>({});
  const { t } = useI18n();

  useEffect(() => {
    // Set Chart.js defaults for LionSpace theme
    Chart.defaults.color = 'rgba(184, 255, 242, 0.8)';
    Chart.defaults.font.family = "'Space Mono', 'Source Sans Pro', monospace";
    Chart.defaults.borderColor = 'rgba(184, 255, 242, 0.2)';
    Chart.defaults.backgroundColor = 'rgba(0, 255, 136, 0.1)';

    // Initialize charts
    const initChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (!canvas) {
        console.warn(`Canvas with id '${id}' not found`);
        return;
      }

      // Destroy existing chart
      if (chartsRef.current[id]) {
        chartsRef.current[id].destroy();
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          chartsRef.current[id] = new Chart(ctx, config);
        } catch (error) {
          console.error(`Failed to initialize chart ${id}:`, error);
        }
      }
    };

    // Initialize all charts
    initChart('sov-chart', getSOVChartConfig());
    initChart('sentiment-chart', getSentimentChartConfig());
    initChart('platform-chart', getPlatformChartConfig());
    initChart('keywords-chart', getKeywordsChartConfig());
    initChart('network-activity-chart', getNetworkActivityChartConfig());
    initChart('threat-level-chart', getThreatLevelChartConfig(82));
    initChart('activity-timeseries-chart', getActivityTimeSeriesConfig());

    return () => {
      Object.values(chartsRef.current).forEach(chart => {
        try {
          chart?.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      });
    };
  }, []);

  // Update charts when data changes
  const updateChartData = (chartId: string, newData: any) => {
    const chart = chartsRef.current[chartId];
    if (chart) {
      chart.data = newData;
      chart.update('none'); // No animation for real-time updates
    }
  };

  return (
    <div className="tab-content active">
      <h2 
        data-i18n-key="analytics_title" 
        className="font-headline text-3xl text-center mb-8 text-[#B8FFF2] tracking-wider"
      >
        {t('analytics_title')}
      </h2>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="kpi-card bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-6 text-center backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <div className="kpi-value text-3xl lg:text-4xl font-bold text-cyan-400 font-mono mb-2">4.2h</div>
          <div 
            className="kpi-label text-gray-400 text-sm" 
            data-i18n-key="analytics_kpi_time_to_counter"
          >
            {t('analytics_kpi_time_to_counter')}
          </div>
        </div>
        
        <div className="kpi-card bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-6 text-center backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
          <div className="kpi-value text-3xl lg:text-4xl font-bold text-green-400 font-mono mb-2">+18%</div>
          <div 
            className="kpi-label text-gray-400 text-sm" 
            data-i18n-key="analytics_kpi_reach_delta"
          >
            {t('analytics_kpi_reach_delta')}
          </div>
        </div>
        
        <div className="kpi-card bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-6 text-center backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
          <div className="kpi-value text-3xl lg:text-4xl font-bold text-blue-400 font-mono mb-2">92%</div>
          <div 
            className="kpi-label text-gray-400 text-sm" 
            data-i18n-key="analytics_kpi_precision"
          >
            {t('analytics_kpi_precision')}
          </div>
        </div>
        
        <div className="kpi-card bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-lg p-6 text-center backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
          <div className="kpi-value text-3xl lg:text-4xl font-bold text-purple-400 font-mono mb-2">1,204</div>
          <div 
            className="kpi-label text-gray-400 text-sm" 
            data-i18n-key="analytics_kpi_ops_ran"
          >
            {t('analytics_kpi_ops_ran')}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Share of Voice Chart */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 
            className="font-headline text-xl mb-4 text-center text-gray-300" 
            data-i18n-key="analytics_chart_sov"
          >
            {t('analytics_chart_sov')}
          </h3>
          <div className="chart-container h-[350px] relative">
            <canvas id="sov-chart"></canvas>
          </div>
        </div>

        {/* Sentiment Analysis Chart */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 
            className="font-headline text-xl mb-4 text-center text-gray-300" 
            data-i18n-key="analytics_chart_sentiment"
          >
            {t('analytics_chart_sentiment')}
          </h3>
          <div className="chart-container h-[350px] relative">
            <canvas id="sentiment-chart"></canvas>
          </div>
        </div>

        {/* Platform Distribution Chart */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 
            className="font-headline text-xl mb-4 text-center text-gray-300" 
            data-i18n-key="analytics_chart_platform"
          >
            {t('analytics_chart_platform')}
          </h3>
          <div className="chart-container h-[350px] relative">
            <canvas id="platform-chart"></canvas>
          </div>
        </div>

        {/* Keywords Chart */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 
            className="font-headline text-xl mb-4 text-center text-gray-300" 
            data-i18n-key="analytics_chart_keywords"
          >
            {t('analytics_chart_keywords')}
          </h3>
          <div className="chart-container h-[350px] relative">
            <canvas id="keywords-chart"></canvas>
          </div>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Activity Radar */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 className="font-headline text-lg mb-4 text-center text-gray-300">
            Network Activity Profile
          </h3>
          <div className="chart-container h-[300px] relative">
            <canvas id="network-activity-chart"></canvas>
          </div>
        </div>

        {/* Threat Level Gauge */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-red-500/30 transition-all duration-300">
          <h3 className="font-headline text-lg mb-4 text-center text-gray-300">
            Current Threat Level
          </h3>
          <div className="chart-container h-[300px] relative flex items-center justify-center">
            <div className="relative">
              <canvas id="threat-level-chart" width="200" height="200"></canvas>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 font-mono">82%</div>
                  <div className="text-sm text-gray-400">HIGH RISK</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Time Series */}
        <div className="chart-card bg-black/20 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-cyan-500/30 transition-all duration-300">
          <h3 className="font-headline text-lg mb-4 text-center text-gray-300">
            24h Activity Pattern
          </h3>
          <div className="chart-container h-[300px] relative">
            <canvas id="activity-timeseries-chart"></canvas>
          </div>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Real-time data • Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact analytics widget for sidebar or dashboard overview
 */
export function AnalyticsWidget() {
  const { t } = useI18n();

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
      <h4 className="font-headline text-lg mb-3 text-[#B8FFF2]">Quick Stats</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Active Threats</span>
          <span className="text-red-400 font-mono font-bold">127</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Monitored Accounts</span>
          <span className="text-cyan-400 font-mono font-bold">2,834</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Avg Response Time</span>
          <span className="text-green-400 font-mono font-bold">4.2h</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Detection Rate</span>
          <span className="text-blue-400 font-mono font-bold">92%</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live monitoring active</span>
        </div>
      </div>
    </div>
  );
}