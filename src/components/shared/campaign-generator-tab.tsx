export default function CampaignGeneratorTab() {
  return (
    <div id="campaign-generator-content" className="tab-content">
        <h2 data-i18n-key="campaign_generator_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Strategic Campaign Generator</h2>
        <p data-i18n-key="campaign_generator_subtitle" className="text-center text-gray-400 mb-6">Turn intelligence into action. Select a target from the OSINT archive to generate a counter-campaign plan.</p>
        <select id="campaign-target-select" className="w-full p-3 mb-4 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none">
            <option value="" data-i18n-key="campaign_generator_select_target">Select a Target...</option>
        </select>
        <button id="generate-campaign-button" className="gemini-button w-full text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="campaign_generator_button">
            Generate Campaign Plan
        </button>
    </div>
  );
}
