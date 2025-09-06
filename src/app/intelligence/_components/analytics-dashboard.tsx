'use client';

import { KpiCard } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/translation-context';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const sovChartRef = useRef<HTMLCanvasElement>(null);
  const sentimentChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sovChartRef.current || !sentimentChartRef.current) return;

    // Share of Voice Chart
    const sovChart = new Chart(sovChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Truth Narratives', 'Disinformation', 'Neutral'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: [
            'rgba(0, 255, 65, 0.8)',
            'rgba(255, 0, 0, 0.8)',
            'rgba(128, 128, 128, 0.8)'
          ],
          borderColor: [
            'rgba(0, 255, 65, 1)',
            'rgba(255, 0, 0, 1)',
            'rgba(128, 128, 128, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af'
            }
          }
        }
      }
    });

    // Sentiment Chart
    const sentimentChart = new Chart(sentimentChartRef.current, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Positive',
          data: [65, 59, 80, 81, 56, 55, 70],
          borderColor: 'rgba(0, 255, 65, 1)',
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          tension: 0.4
        }, {
          label: 'Negative',
          data: [28, 48, 40, 19, 36, 27, 30],
          borderColor: 'rgba(255, 0, 0, 1)',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#9ca3af'
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 255, 65, 0.1)'
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 255, 65, 0.1)'
            },
            ticks: {
              color: '#9ca3af'
            }
          }
        }
      }
    });

    return () => {
      sovChart.destroy();
      sentimentChart.destroy();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          value="4.2h"
          title={t('intelligence.analytics_kpi_time_to_counter')}
          trend={-1}
        />
        <KpiCard
          value="+18%"
          title={t('intelligence.analytics_kpi_reach_delta')}
          trend={1}
        />
        <KpiCard
          value="92%"
          title={t('intelligence.analytics_kpi_precision')}
          trend={1}
        />
        <KpiCard
          value="1,204"
          title={t('intelligence.analytics_kpi_ops_ran')}
          trend={0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            {t('intelligence.analytics_chart_sov')}
          </h3>
          <div className="h-64">
            <canvas ref={sovChartRef}></canvas>
          </div>
        </div>

        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            {t('intelligence.analytics_chart_sentiment')}
          </h3>
          <div className="h-64">
            <canvas ref={sentimentChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}