import React, { useEffect, useRef } from 'react';
import { Bookmark, Briefcase, Activity, CheckCircle, XCircle } from 'lucide-react';
import { gsap } from 'gsap';

export default function StatsDashboard({ applications }) {
  const saved = applications.filter(a => a.status === 'Saved').length;
  const applied = applications.filter(a => a.status === 'Applied' || a.status === 'OA').length;
  const interviews = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Offer').length;

  const stats = [
    { label: 'Saved', value: saved, icon: Bookmark, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
    { label: 'Applied / OA', value: applied, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Interviews', value: interviews, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Offers', value: offers, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={stat.label} stat={stat} index={idx} />
      ))}
    </div>
  );
}

function StatCard({ stat, index }) {
  const countRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Card entrance animation
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
    );
  }, [index]);

  useEffect(() => {
    // Counter animation
    if (countRef.current) {
      const startValue = parseInt(countRef.current.innerText) || 0;
      gsap.fromTo(countRef.current, 
        { innerText: startValue },
        { 
          innerText: stat.value, 
          duration: 1.5, 
          ease: 'power3.out',
          snap: { innerText: 1 },
          stagger: 1,
          onUpdate: function() {
            if (countRef.current) {
              countRef.current.innerText = Math.ceil(this.targets()[0].innerText);
            }
          }
        }
      );
    }
  }, [stat.value]);

  return (
    <div 
      ref={cardRef}
      className={`glass rounded-2xl p-6 border ${stat.border} flex flex-col relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-50 ${stat.color}`}>
        <stat.icon size={48} className="drop-shadow-lg" strokeWidth={1.5} />
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
        <h4 ref={countRef} className={`text-4xl font-bold ${stat.color} drop-shadow-md`}>
          0
        </h4>
      </div>
    </div>
  );
}
