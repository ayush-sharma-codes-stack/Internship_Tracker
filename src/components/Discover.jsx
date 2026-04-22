import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Loader2, AlertCircle, MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { fetchInternships } from '../api/claude';
import ApplicationCard from './ApplicationCard';
import { gsap } from 'gsap';

export default function Discover({ onSaveToTracker }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Filters State
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStipend, setFilterStipend] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [filterDuration, setFilterDuration] = useState('All');

  const cardsContainerRef = useRef(null);

  // Apply filters
  const filteredResults = useMemo(() => {
    return results.filter(app => {
      // Very basic substring/exact matching logic
      const locMatch = filterLocation === 'All' || 
                      (filterLocation === 'Remote' && app.location?.toLowerCase().includes('remote')) ||
                      (filterLocation === 'On-site' && !app.location?.toLowerCase().includes('remote') && app.location !== 'Unknown') ||
                      (filterLocation === 'Hybrid' && app.location?.toLowerCase().includes('hybrid'));
      
      const sourceMatch = filterSource === 'All' || app.source?.toLowerCase() === filterSource.toLowerCase();
      
      // Stipend matching (simple heuristic)
      let stipendMatch = true;
      if (filterStipend === 'Paid') stipendMatch = app.stipend && app.stipend.toLowerCase() !== 'unpaid' && app.stipend !== 'Unknown';
      if (filterStipend === 'Unpaid') stipendMatch = app.stipend?.toLowerCase() === 'unpaid';

      // Duration matching
      let durationMatch = true;
      if (filterDuration === '< 3 Months') durationMatch = app.duration && (app.duration.includes('1') || app.duration.includes('2') || app.duration.includes('3'));
      if (filterDuration === '3-6 Months') durationMatch = app.duration && (app.duration.includes('4') || app.duration.includes('5') || app.duration.includes('6'));

      return locMatch && sourceMatch && stipendMatch && durationMatch;
    });
  }, [results, filterLocation, filterStipend, filterSource, filterDuration]);

  useEffect(() => {
    if (filteredResults.length > 0 && cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('.internship-card');
      gsap.fromTo(cards, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [filteredResults]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const data = await fetchInternships(searchQuery);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for roles, skills, or companies (e.g. React Frontend in NY)"
              className="w-full bg-gray-800 border border-brand-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-lg"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 text-lg active:scale-95"
          >
            {isSearching ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
            Search
          </button>
        </form>

        {/* Filters Panel */}
        <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-gray-800/80 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500">
              <option value="All">Location: All</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-400" />
            <select value={filterStipend} onChange={(e) => setFilterStipend(e.target.value)} className="bg-gray-800/80 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500">
              <option value="All">Stipend: Any</option>
              <option value="Paid">Paid Only</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-400" />
            <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="bg-gray-800/80 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500">
              <option value="All">Source: All</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Internshala">Internshala</option>
              <option value="Unstop">Unstop</option>
              <option value="Wellfound">Wellfound</option>
              <option value="Naukri">Naukri</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} className="bg-gray-800/80 text-sm text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500">
              <option value="All">Duration: Any</option>
              <option value="< 3 Months">{'< 3 Months'}</option>
              <option value="3-6 Months">3-6 Months</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 h-48 animate-pulse flex flex-col">
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3 flex-1 mt-2">
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && filteredResults.length > 0 && (
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResults.map((app, idx) => (
            <ApplicationCard 
              key={app.id || idx}
              app={app}
              mode="discover"
              onSave={onSaveToTracker}
            />
          ))}
        </div>
      )}
      
      {!isSearching && !error && results.length > 0 && filteredResults.length === 0 && (
        <div className="py-10 text-center text-gray-400">
          No internships match your current filters.
        </div>
      )}
      
      {!isSearching && !error && results.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-800/20 rounded-3xl border border-gray-800/50 border-dashed">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Search className="text-gray-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Discover Opportunities</h3>
          <p className="text-gray-500 max-w-md">
            Enter a search query above to have Claude intelligently fetch and parse live internship listings from across the web.
          </p>
        </div>
      )}
    </div>
  );
}
