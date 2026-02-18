
import React, { useState } from 'react';
import { KeyIcon, LockOpenIcon, RocketLaunchIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { User } from '../types';

const IDENTITY_KEY = 'SF_IDENTITY_V5';

const AuthScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const existing = (() => {
    try {
      const saved = localStorage.getItem(IDENTITY_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  })();

  const [username, setUsername] = useState(existing?.username || '');
  const [isInitializing, setIsInitializing] = useState(false);

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsInitializing(true);
    setTimeout(() => {
      const user: User = {
        id: existing?.id || `usr-${Date.now()}`,
        username: username.trim(),
        email: 'local@workspace.sf'
      };
      onLogin(user);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1d]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-600/30">
            <KeyIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">SprintFlow</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">Workspace Access V5</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16"></div>
          
          <h2 className="text-lg font-black text-white text-center mb-8 uppercase tracking-widest flex items-center justify-center gap-3">
            {existing ? <ShieldCheckIcon className="w-5 h-5 text-emerald-400" /> : <UserCircleIcon className="w-5 h-5 text-indigo-400" />}
            {existing ? 'Identity Verified' : 'New Callsign'}
          </h2>

          <form onSubmit={handleEnter} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Workspace Identity</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
                disabled={isInitializing}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-white text-sm font-bold placeholder-slate-700 outline-none focus:border-indigo-500 transition-all"
                placeholder="Callsign..."
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              disabled={!username.trim() || isInitializing}
              className={`w-full py-4 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                username.trim() && !isInitializing ? 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isInitializing ? (
                <RocketLaunchIcon className="w-5 h-5 animate-bounce text-indigo-200" />
              ) : (
                <LockOpenIcon className="w-5 h-5" />
              )}
              {isInitializing ? 'Connecting...' : existing ? 'Resume Workspace' : 'Initialize'}
            </button>
          </form>

          {existing && !isInitializing && (
            <p className="mt-6 text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              Active Profile: <span className="text-indigo-400">{existing.username}</span>
            </p>
          )}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-700 text-[9px] font-black uppercase tracking-widest">
           <ShieldCheckIcon className="w-4 h-4" />
           Local Session Isolated
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
