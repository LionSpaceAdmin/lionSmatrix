'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, ExternalLink, AlertTriangle, Calendar, MapPin, Eye, FileText, Download, Share2 } from 'lucide-react';
import { mergedOsintActors } from '@/lib/data/intelligence-merged';
import { useI18n } from '@/lib/hooks/use-i18n';

type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';

interface ActorData {
  Name: string;
  Platform: string;
  Audience: number;
  Narrative: string;
  Affiliation: string;
  risk: RiskLevel;
  alias?: string;
  followers?: string;
  platforms?: string[];
  keywords?: string[];
  engagement_rate?: string;
  content_frequency?: string;
}

interface OSINTArchiveProps {
  className?: string;
}

export const OSINTArchive: React.FC<OSINTArchiveProps> = ({ className = '' }) => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'risk' | 'audience'>('risk');
  const [selectedActor, setSelectedActor] = useState<ActorData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Convert object to array for filtering
  const actorsArray = useMemo(() => {
    return Object.values(mergedOsintActors) as ActorData[];
  }, []);

  // Filter and sort actors
  const filteredActors = useMemo(() => {
    let filtered = actorsArray.filter((actor: ActorData) => {
      const matchesSearch = actor.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           actor.Narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           actor.Platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (actor.keywords && actor.keywords.some((k: string) => k.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesRisk = selectedRisk === 'all' || actor.risk === selectedRisk;
      
      return matchesSearch && matchesRisk;
    });

    return filtered.sort((a: ActorData, b: ActorData) => {
      switch (sortBy) {
        case 'name':
          return a.Name.localeCompare(b.Name);
        case 'risk':
          const riskOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          return (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0);
        case 'audience':
          return b.Audience - a.Audience;
        default:
          return 0;
      }
    });
  }, [actorsArray, searchTerm, selectedRisk, sortBy]);

  const getRiskBadgeClass = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getActorIcon = () => {
    return <Users className="w-4 h-4" />;
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredActors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `osint_archive_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-400 font-mono">
            {t('OSINT Archive')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredActors.length} active profiles tracked
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 focus:bg-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-sm"
            aria-label="Export filtered actor data as JSON file"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Export Data
          </button>
          
          <div className="flex border border-gray-600 rounded-lg overflow-hidden" role="group" aria-label="View mode selection">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500/20 ${viewMode === 'grid' 
                ? 'bg-green-500/20 text-green-400' 
                : 'text-gray-400 hover:text-green-400'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4" aria-hidden="true">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500/20 ${viewMode === 'list' 
                ? 'bg-green-500/20 text-green-400' 
                : 'text-gray-400 hover:text-green-400'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <div className="space-y-1 w-4 h-4" aria-hidden="true">
                <div className="h-1 bg-current rounded"></div>
                <div className="h-1 bg-current rounded"></div>
                <div className="h-1 bg-current rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label htmlFor="actor-search" className="sr-only">
            Search actors by name, narrative, platform, or keywords
          </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
          <input
            id="actor-search"
            type="text"
            placeholder="Search actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            {filteredActors.length} results found. Use arrow keys to navigate through search suggestions.
          </div>
        </div>

        <div>
          <label htmlFor="risk-filter" className="sr-only">
            Filter by risk level
          </label>
          <select
            id="risk-filter"
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | 'all')}
            className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            aria-label="Filter actors by risk level"
          >
            <option value="all">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-by" className="sr-only">
            Sort results by
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            aria-label="Sort results by criteria"
          >
            <option value="risk">Risk Level</option>
            <option value="name">Name</option>
            <option value="audience">Audience</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter className="w-4 h-4" />
          <span>{filteredActors.length} results</span>
        </div>
      </div>

      {/* Actor Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {filteredActors.map((actor: ActorData, index: number) => (
          <article
            key={actor.Name + index}
            className={`bg-gray-800/30 border border-gray-600/50 rounded-lg p-6 hover:border-green-500/50 focus-within:border-green-500/50 focus-within:ring-2 focus-within:ring-green-500/20 transition-all group ${
              viewMode === 'list' ? 'flex items-center gap-6' : ''
            }`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedActor(actor)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedActor(actor);
              }
            }}
            aria-label={`View details for ${actor.Name}, risk level ${actor.risk}`}
          >
            {/* Avatar/Icon */}
            <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                {getActorIcon()}
              </div>
            </div>

            <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={viewMode === 'list' ? 'min-w-0' : ''}>
                  <h3 className="font-semibold text-white font-mono truncate group-hover:text-green-400 transition-colors">
                    {actor.Name}
                  </h3>
                  <p className={`text-gray-400 text-sm ${viewMode === 'list' ? 'truncate' : ''}`}>
                    {actor.alias || actor.Platform}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono border ${getRiskBadgeClass(actor.risk)} flex-shrink-0`}>
                  {actor.risk}
                </div>
              </div>

              {/* Description */}
              <p className={`text-gray-300 text-sm mb-4 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                {actor.Narrative}
              </p>

              {/* Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{actor.followers || actor.Audience.toLocaleString()} followers</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span>{actor.Affiliation}</span>
                </div>

                {/* Platforms */}
                {actor.platforms && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {actor.platforms.slice(0, viewMode === 'list' ? 3 : 5).map((platform: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600"
                      >
                        {platform}
                      </span>
                    ))}
                    {actor.platforms.length > (viewMode === 'list' ? 3 : 5) && (
                      <span className="px-2 py-1 text-gray-400 text-xs">
                        +{actor.platforms.length - (viewMode === 'list' ? 3 : 5)}
                      </span>
                    )}
                  </div>
                )}

                {/* Keywords */}
                {actor.keywords && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {actor.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between">
                <button 
                  className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 focus:text-green-300 focus:outline-none focus:ring-1 focus:ring-green-500/30 rounded px-1 py-0.5 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedActor(actor);
                  }}
                  aria-label={`View detailed information for ${actor.Name}`}
                >
                  <Eye className="w-4 h-4" aria-hidden="true" />
                  View Details
                </button>
                
                {actor.engagement_rate && (
                  <span className="text-xs text-blue-400" aria-label={`Engagement rate: ${actor.engagement_rate}`}>
                    {actor.engagement_rate} engagement
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredActors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No actors found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Actor Details Modal */}
      {selectedActor && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="actor-modal-title"
          aria-describedby="actor-modal-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedActor(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSelectedActor(null);
            }
          }}
        >
          <div className="bg-gray-800 border border-gray-600 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto focus:outline-none">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 id="actor-modal-title" className="text-xl font-bold text-green-400 font-mono">{selectedActor.Name}</h3>
                  <p className="text-gray-400">{selectedActor.alias}</p>
                </div>
                <button
                  onClick={() => setSelectedActor(null)}
                  className="text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 rounded p-1 transition-colors"
                  aria-label="Close actor details modal"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`px-3 py-2 rounded border ${getRiskBadgeClass(selectedActor.risk)} inline-block`}>
                  Risk Level: {selectedActor.risk}
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Narrative</h4>
                  <p className="text-gray-300">{selectedActor.Narrative}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Affiliation</h4>
                  <p className="text-gray-300">{selectedActor.Affiliation}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Audience</h4>
                    <p className="text-gray-300">{selectedActor.Audience.toLocaleString()}</p>
                  </div>
                  
                  {selectedActor.engagement_rate && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Engagement Rate</h4>
                      <p className="text-gray-300">{selectedActor.engagement_rate}</p>
                    </div>
                  )}
                </div>
                
                {selectedActor.platforms && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActor.platforms.map((platform: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-gray-700 text-gray-300 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedActor.keywords && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActor.keywords.map((keyword: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};