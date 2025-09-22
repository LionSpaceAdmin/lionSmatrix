export default function NewsPulseTab() {
  return (
    <div id="news-pulse-content" className="tab-content">
        <h2 data-i18n-key="news_pulse_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Real-time NewsPulse</h2>
        <p data-i18n-key="news_pulse_subtitle" className="text-center text-gray-400 mb-6">Enter a topic to scan the latest news (last 24 hours) for developing narratives and disinformation signals.</p>
        <input type="text" id="news-topic-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="news_pulse_placeholder" placeholder="e.g., UNRWA funding, Gaza conflict..." />
        <div className="flex justify-center mt-4">
            <button id="scan-news-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="news_pulse_button">
                Scan Real-time News
            </button>
        </div>
    </div>
  );
}
