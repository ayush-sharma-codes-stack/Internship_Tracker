import React, { useRef, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, ExternalLink, Edit2, Trash2, Building2, BookmarkPlus, Clock } from 'lucide-react';
import { statusColors, sourceColors } from '../data/initialData';
import { format, parseISO } from 'date-fns';

export default function ApplicationCard({ app, onEdit, onDelete, onSave, mode = 'tracker' }) {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    if (dateStr === 'Unknown') return dateStr;
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const badgeColor = sourceColors[app.source] || sourceColors["Default"];

  return (
    <div className="internship-card glass rounded-2xl p-5 hover:bg-gray-800/60 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col relative overflow-hidden">
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
            <Building2 className="text-gray-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100 leading-tight group-hover:text-brand-400 transition-colors line-clamp-1">
              {app.company}
            </h3>
            <p className="text-sm text-gray-400 font-medium line-clamp-1">{app.role}</p>
          </div>
        </div>
        
        {mode === 'tracker' ? (
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusColors[app.status]}`}>
            {app.status}
          </span>
        ) : (
          <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${badgeColor}`}>
            {app.source || 'Web'}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 flex-1 relative z-10">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin size={14} className="text-gray-500" />
          <span className="line-clamp-1">{app.location || 'Unknown'}</span>
        </div>
        
        {mode === 'discover' && app.duration && app.duration !== 'Unknown' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={14} className="text-gray-500" />
            <span>{app.duration}</span>
          </div>
        )}

        {(mode === 'tracker' || app.postedDate) && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={14} className="text-gray-500" />
            <span>{mode === 'tracker' ? formatDate(app.dateApplied) : `Posted: ${formatDate(app.postedDate)}`}</span>
          </div>
        )}
        
        {app.stipend && app.stipend !== 'Unknown' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign size={14} className="text-gray-500" />
            <span>{app.stipend}</span>
          </div>
        )}

        {app.skills && app.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {app.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-300 rounded-md">
                {skill}
              </span>
            ))}
            {app.skills.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-500 rounded-md">
                +{app.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          {app.link || app.applyLink ? (
            <a 
              href={app.link || app.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
              title="View Job Posting"
            >
              <ExternalLink size={16} />
            </a>
          ) : <div />}
        </div>
        
        {mode === 'tracker' ? (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(app)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              title="Edit Application"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(app.id)}
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Application"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onSave(app)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
              title="Save to Tracker"
            >
              <BookmarkPlus size={16} />
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
