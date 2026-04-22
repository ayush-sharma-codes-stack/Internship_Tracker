import React, { useRef, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { statuses } from '../data/initialData';
import ApplicationCard from './ApplicationCard';
import { gsap } from 'gsap';

export default function MyTracker({ 
  applications, 
  searchQuery, 
  setSearchQuery, 
  filterStatus, 
  setFilterStatus, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  const cardsContainerRef = useRef(null);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('.internship-card');
      gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-800/30 p-4 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search saved applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <Filter className="text-gray-400" size={20} />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <button 
            onClick={onAdd}
            className="group flex items-center justify-center p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/25 transition-all active:scale-95"
            title="Add Custom Application"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <div 
        ref={cardsContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredApps.length > 0 ? (
          filteredApps.map(app => (
            <ApplicationCard 
              key={app.id} 
              app={app} 
              mode="tracker"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-gray-800/20 rounded-3xl border border-gray-800/50 border-dashed">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="text-gray-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No applications found</h3>
            <p className="text-gray-500 max-w-md">
              Try adjusting your search or filters, or discover new opportunities using the Discover tab!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
