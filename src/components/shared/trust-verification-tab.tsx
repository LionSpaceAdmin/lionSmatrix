export default function TrustVerificationTab() {
  return (
    <div id="trust-verification-content" className="tab-content">
        <h2 data-i18n-key="trust_verification_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Trust & Verification</h2>
        <p data-i18n-key="trust_verification_subtitle" className="text-center text-gray-400 mb-6">Submit a previous analysis or contentious text for an automated audit. The AI will act as a "red team" to challenge its own conclusions.</p>
        <textarea id="verification-input" className="w-full h-32 p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="trust_verification_placeholder" placeholder="Paste original text or previous analysis output here..."></textarea>
        <div className="flex justify-center mt-4">
            <button id="verify-analysis-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="trust_verification_button">
                Request Verification
            </button>
        </div>
    </div>
  );
}
