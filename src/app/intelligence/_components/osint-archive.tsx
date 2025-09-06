'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/contexts/translation-context';
// import { osintActors, searchActors, sortActors } from '@/lib/data/osint-actors';

// Placeholder data for now
const osintActors = [
  { id: '1', name: 'Actor 1', platform: 'Twitter', audience: 10000, narrative: 'Sample narrative 1', dossier: 'Sample dossier 1' },
  { id: '2', name: 'Actor 2', platform: 'Facebook', audience: 5000, narrative: 'Sample narrative 2', dossier: 'Sample dossier 2' },
];

const searchActors = (query: string) => 
  osintActors.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

const sortActors = (actors: typeof osintActors, field: string, asc: boolean) => 
  [...actors].sort((a, b) => {
    const val = field === 'audience' ? a.audience - b.audience : 
                a.name.localeCompare(b.name);
    return asc ? val : -val;
  });

export function OsintArchive() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'platform' | 'audience'>('name');
  const [ascending, setAscending] = useState(true);
  const [selectedActor, setSelectedActor] = useState<typeof osintActors[0] | null>(null);

  const filteredAndSorted = useMemo(() => {
    const filtered = searchQuery ? searchActors(searchQuery) : osintActors;
    return sortActors(filtered, sortBy, ascending);
  }, [searchQuery, sortBy, ascending]);

  const handleSort = (field: 'name' | 'platform' | 'audience') => {
    if (sortBy === field) {
      setAscending(!ascending);
    } else {
      setSortBy(field);
      setAscending(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
          {t('intelligence.osint_archive_title')}
        </h2>
        <p className="text-gray-400 mb-6">
          {t('intelligence.osint_archive_subtitle')}
        </p>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 mb-6 bg-black border border-green-400/30 rounded-md text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder={t('intelligence.osint_archive_placeholder_search')}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-green-400/20">
                <th 
                  className="p-3 cursor-pointer hover:text-green-400 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  {t('intelligence.osint_archive_table_name')} {sortBy === 'name' && (ascending ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:text-green-400 transition-colors"
                  onClick={() => handleSort('platform')}
                >
                  {t('intelligence.osint_archive_table_platform')} {sortBy === 'platform' && (ascending ? '↑' : '↓')}
                </th>
                <th 
                  className="p-3 cursor-pointer hover:text-green-400 transition-colors"
                  onClick={() => handleSort('audience')}
                >
                  {t('intelligence.osint_archive_table_audience')} {sortBy === 'audience' && (ascending ? '↑' : '↓')}
                </th>
                <th className="p-3">Narrative</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((actor) => (
                <tr 
                  key={actor.name}
                  className="border-b border-green-400/10 hover:bg-green-400/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedActor(actor)}
                >
                  <td className="p-3 text-green-400">{actor.name}</td>
                  <td className="p-3 text-gray-400">{actor.platform}</td>
                  <td className="p-3 text-gray-400">{actor.audience.toLocaleString()}</td>
                  <td className="p-3 text-gray-400">{actor.narrative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedActor && selectedActor.dossier && (
        <div className="bg-black/50 border border-green-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            Dossier: {selectedActor.name}
          </h3>
          <div 
            className="text-gray-300"
            dangerouslySetInnerHTML={{ __html: selectedActor.dossier }}
          />
          <button
            onClick={() => setSelectedActor(null)}
            className="mt-4 px-4 py-2 bg-green-400/20 border border-green-400 text-green-400 rounded-md hover:bg-green-400/30 transition-all"
          >
            Close Dossier
          </button>
        </div>
      )}
    </div>
  );
}