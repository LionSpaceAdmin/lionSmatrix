"use client";

import { useState, useEffect } from 'react';
import { osintData } from '@/lib/data';

export default function OsintArchiveTab({ onOpenDossier }: { onOpenDossier: (actorName: string) => void }) {
  const [data, setData] = useState(osintData);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredData = osintData.filter(actor =>
      actor.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  }, [searchTerm]);

  return (
    <div id="osint-archive-content" className="tab-content">
        <h2 data-i18n-key="osint_archive_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">#FakeResistance OSINT Archive</h2>
        <p data-i18n-key="osint_archive_subtitle" className="text-center text-gray-400 mb-6">Explore the database of actors involved in the disinformation network. Click a name for a full dossier.</p>
        <input
          type="text"
          id="osint-search"
          className="w-full p-3 mb-4 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none"
          data-i18n-key="osint_archive_placeholder_search"
          placeholder="Search actors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto">
            <table id="osint-table" className="w-full text-left font-body">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="p-2" data-sort="Name" data-i18n-key="osint_archive_table_name">Name 🔽</th>
                        <th className="p-2" data-sort="Platform" data-i18n-key="osint_archive_table_platform">Platform</th>
                        <th className="p-2" data-sort="Audience" data-i18n-key="osint_archive_table_audience">Audience</th>
                    </tr>
                </thead>
                <tbody id="osint-table-body">
                  {data.map(actor => (
                    <tr key={actor.Name} className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer" onClick={() => onOpenDossier(actor.Name)}>
                      <td className="p-2 text-[#B8FFF2]">{actor.Name}</td>
                      <td className="p-2">{actor.Platform}</td>
                      <td className="p-2">{actor.Audience > 1000000 ? `${(actor.Audience / 1000000).toFixed(1)}M` : `${Math.round(actor.Audience / 1000)}K`}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
