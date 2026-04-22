import React, { useState, useEffect } from 'react';
import { initialApplications } from './data/initialData';
import Sidebar from './components/Sidebar';
import Discover from './components/Discover';
import MyTracker from './components/MyTracker';
import StatsDashboard from './components/StatsDashboard';
import ApplicationForm from './components/ApplicationForm';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

console.log(API_KEY) // browser console mein sk-ant-xxx dikhna chahiye
function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('trackerApps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialApplications;
      }
    }
    return initialApplications;
  });

  useEffect(() => {
    localStorage.setItem('trackerApps', JSON.stringify(applications));
  }, [applications]);
  
  // Tracker state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleAdd = (newData) => {
    const newApp = { ...newData, id: Date.now().toString() };
    setApplications([newApp, ...applications]);
  };

  const handleEdit = (updatedData) => {
    setApplications(applications.map(app => 
      app.id === updatedData.id ? updatedData : app
    ));
    setEditingApp(null);
  };

  const handleDelete = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const handleSaveToTracker = (discoveredApp) => {
    const newApp = {
      ...discoveredApp,
      id: Date.now().toString(),
      status: 'Saved',
      dateApplied: new Date().toISOString().split('T')[0], // Default to today
      notes: `Source: ${discoveredApp.source}. Duration: ${discoveredApp.duration}`
    };
    setApplications([newApp, ...applications]);
    setActiveTab('tracker'); // Optional: redirect to tracker after saving, or just show a toast. We'll just change tab for immediate feedback.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-brand-500 selection:text-white flex flex-col md:flex-row p-4 md:p-8 gap-8">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:mx-0">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500 inline-block drop-shadow-sm">
            {activeTab === 'discover' && 'Discover Internships'}
            {activeTab === 'tracker' && 'My Application Tracker'}
            {activeTab === 'dashboard' && 'Analytics Dashboard'}
          </h2>
          <p className="text-gray-400 mt-2">
            {activeTab === 'discover' && 'Find live opportunities tailored for you.'}
            {activeTab === 'tracker' && 'Manage your saved jobs and applications.'}
            {activeTab === 'dashboard' && 'Track your success rate and pipeline.'}
          </p>
        </header>

        <div className="w-full relative">
          {activeTab === 'discover' && (
            <Discover onSaveToTracker={handleSaveToTracker} />
          )}

          {activeTab === 'tracker' && (
            <MyTracker 
              applications={applications}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onAdd={() => {
                setEditingApp(null);
                setIsFormOpen(true);
              }}
              onEdit={(app) => {
                setEditingApp(app);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <StatsDashboard applications={applications} />
              
              <div className="glass p-8 rounded-2xl border border-gray-700/50">
                <h3 className="text-xl font-bold mb-6 text-gray-100">Application Pipeline</h3>
                {/* Visual Pipeline Funnel (Simplified version using CSS grid) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  {['Saved', 'Applied', 'OA', 'Interview', 'Offer'].map((step, idx) => {
                    const count = applications.filter(a => a.status === step).length;
                    return (
                      <div key={step} className="relative">
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl relative z-10 flex flex-col justify-center items-center h-24">
                          <span className="text-2xl font-bold text-brand-400">{count}</span>
                          <span className="text-sm text-gray-400">{step}</span>
                        </div>
                        {idx < 4 && (
                          <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-0.5 bg-gray-700 z-0"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Application Form Modal */}
      {isFormOpen && (
        <ApplicationForm 
          initialData={editingApp}
          onClose={() => {
            setIsFormOpen(false);
            setEditingApp(null);
          }}
          onSubmit={editingApp ? handleEdit : handleAdd}
        />
      )}
    </div>
  );
}

export default App;
