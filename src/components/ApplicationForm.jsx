import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { statuses } from '../data/initialData';
import { gsap } from 'gsap';

export default function ApplicationForm({ onClose, onSubmit, initialData = null }) {
  const formRef = useRef(null);
  const overlayRef = useRef(null);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'Wishlist',
    stipend: '',
    link: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    
    // Mount animation
    gsap.fromTo(overlayRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo(formRef.current, 
      { opacity: 0, y: 50, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
    );
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    // Unmount animation
    gsap.to(formRef.current, { opacity: 0, y: 50, scale: 0.95, duration: 0.3, ease: 'power2.in' });
    gsap.to(overlayRef.current, { 
      opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1, 
      onComplete: onClose 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div 
        ref={formRef}
        className="w-full max-w-2xl bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-100">
            {initialData ? 'Edit Application' : 'New Application'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Company *</label>
              <input 
                required
                type="text" 
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Role *</label>
              <input 
                required
                type="text" 
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Intern"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, NY"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Date Applied</label>
              <input 
                type="date" 
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Status *</label>
              <select 
                required
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Stipend / Salary</label>
              <input 
                type="text" 
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="e.g. $8000/mo"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Application / Job Link</label>
            <input 
              type="url" 
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any details to remember..."
              rows={3}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none custom-scrollbar"
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-900/50">
          <button 
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            {initialData ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  );
}
