
import React from 'react';
import { BeakerIcon, ChartBarIcon, Squares2X2Icon, ShieldCheckIcon, CloudIcon, CheckCircleIcon, ArrowPathIcon, ExclamationCircleIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { SyncStatus, User } from '../types';

interface HeaderProps {
  setView: (view: 'hub' | 'planner' | 'dashboard' | 'profile') => void;
  currentView: 'hub' | 'planner' | 'dashboard' | 'profile';
  syncStatus: SyncStatus;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ setView, currentView, syncStatus, user }) => {
  const renderSyncIndicator = () => {
    switch (syncStatus) {
      case 'syncing':
        return <div className="flex items-center gap-1.5 text-amber-400 animate-pulse"><ArrowPathIcon className="w-3 h-3 animate-spin" /><span className="text-[10px] font-bold uppercase hidden md:inline">Syncing</span></div>;
      case 'synced':
        return <div className="flex items-center gap-1.5 text-emerald-400"><CheckCircleIcon className="w-3 h-3" /><span className="text-[10px] font-bold uppercase hidden md:inline">Synced</span></div>;
      case 'error':
        return <div className="flex items-center gap-1.5 text-red-400"><ExclamationCircleIcon className="w-3 h-3" /><span className="text-[10px] font-bold uppercase hidden md:inline">Sync Error</span></div>;
      default:
        return <div className="flex items-center gap-1.5 text-slate-500"><CloudIcon className="w-3 h-3" /><span className="text-[10px] font-bold uppercase hidden md:inline">Local Only</span></div>;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <BeakerIcon className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-white">SprintFlow <span className="text-indigo-400">AI</span></h1>
            {renderSyncIndicator()}
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <button 
            onClick={() => setView('hub')}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'hub' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Quest Hub</span>
          </button>
          <button 
            onClick={() => setView('planner')}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'planner' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Squares2X2Icon className="w-4 h-4" />
            <span className="hidden sm:inline">Planner</span>
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ChartBarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-4 w-px bg-slate-700 mx-2"></div>
          <button 
            onClick={() => setView('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 md:pr-4 py-1.5 rounded-full text-sm font-medium transition-all border border-slate-700 ${
              currentView === 'profile' 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-xs text-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline ml-2">{user?.username || 'Profile'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
