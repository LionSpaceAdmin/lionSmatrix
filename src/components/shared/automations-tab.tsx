export default function AutomationsTab() {
  return (
    <div id="automations-content" className="tab-content">
        <h2 data-i18n-key="automations_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Automations & Tasks</h2>
        <p data-i18n-key="automations_subtitle" className="text-center text-gray-400 mb-6">Define triggers to automate intelligence gathering and content creation. Set it and forget it.</p>
        <div className="bg-black bg-opacity-20 p-4 rounded-lg mb-6">
            <h3 className="font-headline text-xl mb-4 text-gray-300" data-i18n-key="automations_create_title">Create New Automation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" id="automation-trigger-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="automations_placeholder_trigger" placeholder="Trigger Keyword/Topic..." />
                <select id="automation-action-select" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none">
                    <option value="daily_brief" data-i18n-key="automations_action_brief">Generate Daily Intelligence Brief</option>
                    <option value="weekly_summary" data-i18n-key="automations_action_summary">Generate Weekly Summary</option>
                </select>
                <button id="create-automation-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-6 rounded-md" data-i18n-key="automations_button_create">
                   Create Automation
                </button>
            </div>
        </div>
         <div className="bg-black bg-opacity-20 p-4 rounded-lg">
            <h3 className="font-headline text-xl mb-4 text-gray-300" data-i18n-key="automations_active_title">Active Automations</h3>
            <ul id="active-automations-list">
                <li className="flex justify-between items-center p-2 border-b border-gray-800"><span className="font-body">Daily Brief for "UNRWA"</span><span className="text-xs text-gray-500">Runs at 08:00</span></li>
                 <li className="flex justify-between items-center p-2 border-b border-gray-800"><span className="font-body">Weekly Summary for "Hezbollah"</span><span className="text-xs text-gray-500">Runs on Sundays</span></li>
            </ul>
        </div>
    </div>
  );
}
