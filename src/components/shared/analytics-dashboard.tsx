import SovChart from './sov-chart';
import SentimentChart from './sentiment-chart';
import PlatformChart from './platform-chart';
import KeywordsChart from './keywords-chart';

export default function AnalyticsDashboard() {
  return (
    <div id="analytics-content" className="tab-content active">
        <h2 data-i18n-key="analytics_title" className="font-headline text-3xl text-center mb-6 text-[#B8FFF2]">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card">
                <div className="kpi-value">4.2h</div>
                <div className="kpi-label" data-i18n-key="analytics_kpi_time_to_counter">Avg. Time to Counter</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">+18%</div>
                <div className="kpi-label" data-i18n-key="analytics_kpi_reach_delta">Reach Delta (7d)</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">92%</div>
                <div className="kpi-label" data-i18n-key="analytics_kpi_precision">Analysis Precision</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-value">1,204</div>
                <div className="kpi-label" data-i18n-key="analytics_kpi_ops_ran">Campaigns Ran</div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-20 p-4 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center text-gray-300" data-i18n-key="analytics_chart_sov">Narrative Share of Voice (SOV)</h3>
                <div className="chart-container">
                    <SovChart />
                </div>
            </div>
            <div className="bg-black bg-opacity-20 p-4 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center text-gray-300" data-i18n-key="analytics_chart_sentiment">Sentiment Analysis Over Time</h3>
                <div className="chart-container">
                     <SentimentChart />
                </div>
            </div>
             <div className="bg-black bg-opacity-20 p-4 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center text-gray-300" data-i18n-key="analytics_chart_platform">Disinformation Signals by Platform</h3>
                <div className="chart-container">
                     <PlatformChart />
                </div>
            </div>
             <div className="bg-black bg-opacity-20 p-4 rounded-lg">
                <h3 className="font-headline text-xl mb-4 text-center text-gray-300" data-i18n-key="analytics_chart_keywords">Trending Disinfo Keywords</h3>
                <div className="chart-container">
                     <KeywordsChart />
                </div>
            </div>
        </div>
    </div>
  );
}
