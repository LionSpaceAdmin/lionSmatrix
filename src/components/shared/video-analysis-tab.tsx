export default function VideoAnalysisTab() {
  return (
    <div id="video-analysis-content" className="tab-content">
        <h2 data-i18n-key="video_analysis_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Video Propaganda Analysis</h2>
        <p data-i18n-key="video_analysis_subtitle" className="text-center text-gray-400 mb-6">Paste a video URL (e.g., from YouTube, X, etc.) to analyze its narrative and authenticity.</p>
        <input type="text" id="video-url-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="video_analysis_placeholder" placeholder="https://www.youtube.com/watch?v=..." />
        <div className="flex justify-center mt-4">
            <button id="analyze-video-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="video_analysis_button">
                Analyze Video
            </button>
        </div>
    </div>
  );
}
