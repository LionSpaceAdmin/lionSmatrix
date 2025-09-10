import { ChartConfiguration } from 'chart.js';

/**
 * Get configuration for Share of Voice (SOV) doughnut chart
 */
export function getSOVChartConfig(): ChartConfiguration {
  return {
    type: 'doughnut',
    data: {
      labels: ['Pro-Resistance Narrative', 'Factual/Neutral', 'Pro-Western Narrative', 'Other'],
      datasets: [{
        label: 'Share of Voice',
        data: [55 + Math.random() * 5, 25 + Math.random() * 5, 15 + Math.random() * 5, 5],
        backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#64748b'],
        borderColor: '#0B1220',
        borderWidth: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          position: 'bottom',
          labels: {
            color: '#B8FFF2',
            font: {
              family: 'Space Mono, monospace'
            }
          }
        },
        tooltip: {
          backgroundColor: '#0B1220',
          borderColor: '#00ff88',
          borderWidth: 1,
          titleColor: '#00ff88',
          bodyColor: '#B8FFF2'
        }
      }
    }
  };
}

/**
 * Get configuration for sentiment analysis line chart
 */
export function getSentimentChartConfig(): ChartConfiguration {
  return {
    type: 'line',
    data: {
      labels: ['7d ago', '6d', '5d', '4d', '3d', '2d', 'Today'],
      datasets: [{
        label: 'Hostile Sentiment',
        data: [65, 68, 72, 65, 75, 80, 82].map(d => d + Math.random() * 3),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
      }, {
        label: 'Supportive Sentiment',
        data: [35, 32, 28, 35, 25, 20, 18].map(d => d + Math.random() * 3),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2'
          }
        },
        y: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#B8FFF2'
          }
        }
      }
    }
  };
}

/**
 * Get configuration for platform distribution bar chart
 */
export function getPlatformChartConfig(): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels: ['X', 'Telegram', 'TikTok', 'Facebook', 'Rumble'],
      datasets: [{
        label: 'Disinfo Signals Detected',
        data: [1200, 950, 700, 450, 200].map(d => d + Math.random() * 50),
        backgroundColor: 'rgba(184, 255, 242, 0.5)',
        borderColor: '#B8FFF2',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2'
          }
        },
        y: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2'
          }
        }
      },
      plugins: { 
        legend: { 
          display: false 
        },
        tooltip: {
          backgroundColor: '#0B1220',
          borderColor: '#00ff88',
          borderWidth: 1
        }
      }
    }
  };
}

/**
 * Get configuration for trending keywords polar area chart
 */
export function getKeywordsChartConfig(): ChartConfiguration {
  return {
    type: 'polarArea',
    data: {
      labels: ['Genocide', 'Zionist Entity', 'Resistance', 'Deep State', 'Propaganda'],
      datasets: [{
        label: 'Keyword Frequency',
        data: [450, 400, 350, 250, 200].map(d => d + Math.random() * 20),
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(168, 85, 247, 0.6)',
        ],
        borderColor: '#0B1220',
        borderWidth: 2
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2',
            backdropColor: '#0B1220'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#B8FFF2'
          }
        }
      }
    }
  };
}

/**
 * Get configuration for network activity radar chart
 */
export function getNetworkActivityChartConfig(): ChartConfiguration {
  return {
    type: 'radar',
    data: {
      labels: ['Content Creation', 'Amplification', 'Coordination', 'Bot Activity', 'Cross-Platform', 'Engagement'],
      datasets: [{
        label: 'Jackson Hinkle Network',
        data: [85, 92, 78, 65, 88, 95],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ef4444'
      }, {
        label: 'Baseline Activity',
        data: [50, 50, 50, 50, 50, 50],
        borderColor: '#64748b',
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        pointBackgroundColor: '#64748b',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#64748b'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: {
            color: 'rgba(184, 255, 242, 0.1)'
          },
          ticks: {
            color: '#B8FFF2',
            backdropColor: '#0B1220'
          },
          pointLabels: {
            color: '#B8FFF2',
            font: {
              size: 10
            }
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#B8FFF2'
          }
        }
      }
    }
  };
}

/**
 * Get configuration for threat level gauge chart
 */
export function getThreatLevelChartConfig(threatLevel: number = 75): ChartConfiguration {
  return {
    type: 'doughnut',
    data: {
      labels: ['Threat Level', 'Remaining'],
      datasets: [{
        data: [threatLevel, 100 - threatLevel],
        backgroundColor: [
          threatLevel > 80 ? '#ef4444' : threatLevel > 60 ? '#f59e0b' : threatLevel > 40 ? '#eab308' : '#22c55e',
          'rgba(100, 116, 139, 0.2)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      }
    }
  };
}

/**
 * Get configuration for time series activity chart
 */
export function getActivityTimeSeriesConfig(): ChartConfiguration {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = hours.map(() => Math.floor(Math.random() * 100) + 20);
  
  return {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: 'Activity Level',
        data: data,
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#B8FFF2',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12
          }
        },
        y: {
          grid: {
            color: 'rgba(184, 255, 242, 0.05)'
          },
          ticks: {
            color: '#B8FFF2'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0B1220',
          borderColor: '#00ff88',
          borderWidth: 1,
          titleColor: '#00ff88',
          bodyColor: '#B8FFF2'
        }
      }
    }
  };
}

/**
 * Default chart options for consistent styling
 */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#B8FFF2',
        font: {
          family: 'Space Mono, monospace',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: '#0B1220',
      borderColor: '#00ff88',
      borderWidth: 1,
      titleColor: '#00ff88',
      bodyColor: '#B8FFF2',
      titleFont: {
        family: 'Space Mono, monospace',
        size: 14
      },
      bodyFont: {
        family: 'Space Mono, monospace',
        size: 12
      }
    }
  }
};