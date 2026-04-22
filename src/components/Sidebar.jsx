import React from 'react';
import { Compass, LayoutDashboard, Briefcase, GraduationCap } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'tracker', label: 'My Tracker', icon: Briefcase },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-100 leading-tight">InternTrack</h1>
          <p className="text-xs text-brand-400 font-medium tracking-wide">AI POWERED</p>
        </div>
      </div>

      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 px-4 custom-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap \${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400 shadow-sm border border-brand-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
              }`}
            >
              <tab.icon size={20} className={isActive ? 'text-brand-400' : 'text-gray-500'} />
              {tab.label}
            </button>
          );
        })}
      </nav>
      
      {/* Decorative element for sidebar bottom */}
      <div className="mt-auto hidden md:block px-4">
        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 text-xs text-gray-400 leading-relaxed backdrop-blur-sm">
          Use the <span className="text-brand-400 font-medium">Discover</span> tab to fetch live internship postings from multiple platforms instantly using AI.
        </div>
      </div>
    </div>
  );
}
