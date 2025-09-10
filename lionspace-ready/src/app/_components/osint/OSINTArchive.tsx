'use client';

import React, { useState, useMemo } from 'react';
import { osintData, deepDives, formatAudience, searchActors, type OSINTActor } from '@/data/osint-data';

interface DossierModalProps {
  actor: OSINTActor | null;
  onClose: () => void;
  onAISummary: (actor: OSINTActor) => void;
  onLaunchResearch: (actor: OSINTActor) => void;
}

function DossierModal({ actor, onClose, onAISummary, onLaunchResearch }: DossierModalProps) {
  if (!actor) return null;

  const deepDiveData = deepDives[actor.Name];

  return (
    <div 
      id="dossier-modal" 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ display: 'flex' }}
    >
      <div className="bg-gray-900 p-8 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-2xl text-[#B8FFF2]">
            Dossier: {actor.Name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        
        <div id="dossier-content" className="space-y-4">
          <p><strong>Platform:</strong> {actor.Platform}</p>
          <p><strong>Audience Size:</strong> {actor.Audience.toLocaleString()}</p>
          <p><strong>Primary Narrative:</strong> {actor.Narrative}</p>
          <p><strong>Known Affiliation:</strong> {actor.Affiliation}</p>
          
          {deepDiveData?.report ? (
            <>
              <hr className="my-4 border-gray-600" />
              <div dangerouslySetInnerHTML={{ __html: deepDiveData.report }} />
            </>
          ) : (
            <p className="mt-4 text-gray-500">No deep dive report available. Generate one below.</p>
          )}
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => onAISummary(actor)}
            className="gemini-button text-sm py-2 px-4 rounded-md"
          >
            🤖 AI Summary
          </button>
          <button
            onClick={() => onLaunchResearch(actor)}
            className="gemini-button text-sm py-2 px-4 rounded-md"
          >
            🔍 Launch Research
          </button>
        </div>
      </div>
    </div>
  );
}

export function OSINTArchive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActor, setSelectedActor] = useState<OSINTActor | null>(null);
  
  const filteredData = useMemo(() => {
    return searchTerm ? searchActors(searchTerm, osintData) : osintData;
  }, [searchTerm]);

  const handleOpenDossier = (actor: OSINTActor) => {
    setSelectedActor(actor);
  };

  const handleCloseDossier = () => {
    setSelectedActor(null);
  };

  const handleAISummary = async (actor: OSINTActor) => {
    // TODO: Implement AI summary functionality
    console.log('AI Summary for:', actor.Name);
    // This would integrate with the Gemini API
  };

  const handleLaunchResearch = (actor: OSINTActor) => {
    // TODO: Implement research launch functionality
    console.log('Launch Research for:', actor.Name);
    // This would switch to investigation tab and populate the input
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">
        #FakeResistance OSINT Archive
      </h2>
      <p className="text-center text-gray-400 mb-6">
        A comprehensive database of identified actors in the fake resistance information ecosystem.
      </p>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search actors, platforms, or narratives..."
          className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none"
        />
      </div>

      {/* OSINT Table */}
      <div className="overflow-x-auto">
        <table id="osint-table" className="w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-[#B8FFF2] cursor-pointer">Actor Name</th>
              <th className="p-3 text-left text-[#B8FFF2] cursor-pointer">Platform</th>
              <th className="p-3 text-left text-[#B8FFF2] cursor-pointer">Audience</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((actor, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleOpenDossier(actor)}
              >
                <td className="p-2 text-[#B8FFF2]">{actor.Name}</td>
                <td className="p-2">{actor.Platform}</td>
                <td className="p-2">{formatAudience(actor.Audience)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dossier Modal */}
      <DossierModal
        actor={selectedActor}
        onClose={handleCloseDossier}
        onAISummary={handleAISummary}
        onLaunchResearch={handleLaunchResearch}
      />
    </div>
  );
}