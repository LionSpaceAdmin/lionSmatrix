export default function AudioAnalysisTab() {
  return (
    <div id="audio-analysis-content" className="tab-content">
         <h2 data-i18n-key="audio_analysis_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Audio Propaganda Analysis</h2>
        <p data-i18n-key="audio_analysis_subtitle" className="text-center text-gray-400 mb-6">Upload an audio file (e.g., podcast clip, voice message) to transcribe and analyze its narrative.</p>
        <input type="file" id="audio-upload-input" className="hidden" accept="audio/*" />
        <label htmlFor="audio-upload-input" id="audio-upload-label" className="gemini-button w-full text-center block text-lg text-[#B8FFF2] py-3 px-10 rounded-md cursor-pointer mb-4" data-i18n-key="audio_analysis_label">
            Select Audio File
        </label>
        <p id="audio-file-name" className="text-center text-gray-500 mb-4" data-i18n-key="audio_analysis_no_file">No file selected.</p>
         <button id="analyze-audio-button" className="gemini-button w-full text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="audio_analysis_button">
            Transcribe & Analyze Audio
        </button>
    </div>
  );
}
