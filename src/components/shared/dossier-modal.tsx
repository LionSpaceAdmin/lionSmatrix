"use client";

import { useEffect } from 'react';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  actor: any;
}

export default function DossierModal({ isOpen, onClose, actor }: DossierModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div id="dossier-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[90vh] bg-black bg-opacity-80 border border-[#B8FFF2] rounded-lg shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 id="dossier-title" className="font-headline text-2xl text-[#B8FFF2]" data-i18n-key="dossier_title">Dossier: {actor?.Name}</h2>
                <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
            </div>
            <div id="dossier-content" className="p-6 overflow-y-auto text-gray-300">
                <h3>Biographical Background</h3>
                <p>{actor?.Name} is an influencer with an audience of {actor?.Audience}.</p>
                <h3>Political and Public Activity</h3>
                <p>Platform: {actor?.Platform}</p>
                <p>Narrative: {actor?.Narrative}</p>
                <h3>Links to Political, State, and Ideological Actors</h3>
                <p>Affiliation: {actor?.Affiliation}</p>
            </div>
            <div className="p-4 mt-auto border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                <button id="dossier-ai-summary" className="gemini-button w-full text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="dossier_button_summary" onClick={() => console.log('Generate AI Dossier')}>
                   Generate AI Dossier
                </button>
                <button id="dossier-launch-research" className="gemini-button w-full text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="dossier_button_research" onClick={() => console.log('Launch Deep Research')}>
                   Launch Deep Research
                </button>
            </div>
        </div>
    </div>
  );
}
