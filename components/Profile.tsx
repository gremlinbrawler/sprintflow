
import React, { useState } from 'react';
import { CompletedSprint, Task, BreakItem, User } from '../types';
import { TrophyIcon, BoltIcon, FireIcon, HandRaisedIcon, IdentificationIcon, StarIcon, CloudIcon, LinkIcon, PencilIcon, PowerIcon, KeyIcon } from '@heroicons/react/24/outline';

interface ProfileProps {
  history: CompletedSprint[];
  username: string;
  setUsername: (name: string) => void;
  tasks: Task[];
  breakItems: BreakItem[];
  user: User | null;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ history, username, setUsername, user, onLogout }) => {
  const totalSprints = history.length;
  const totalWorkSaved = history.reduce((acc, curr) => acc + (curr.totalWorkTimeSaved || 0), 0);
  const totalBreaksTaken = history.reduce((acc, curr) => 
    acc + curr.blocks.filter(b => b.type === 'BREAK' && b.actualDuration !== undefined).length, 0);
  
  const xp = (totalSprints * 100) + (Math.floor(totalWorkSaved) * 10);
  const level = Math.floor(xp / 500) + 1;
  const progress = (xp % 500) / 5;

  const achievements = [
    { id: 'speed', title: 'Speed Demon', desc: 'Save over 30 mins in work sessions', unlocked: totalWorkSaved >= 30, icon: BoltIcon, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'focus', title: 'Focus Master', desc: 'Complete 5 full work sprints', unlocked: totalSprints >= 5, icon: FireIcon, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'zen', title: 'Zen Practitioner', desc: 'Take 10 mindful breaks', unlocked: totalBreaksTaken >= 10, icon: HandRaisedIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'legend', title: 'Sprinter Legend', desc: 'Reach Level 5 Productivity', unlocked: level >= 5, icon: StarIcon, color: 'text-indigo-400', bg: 'bg-indigo-400/10' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Profile Hero Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/20 flex-shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <div className="relative group max-w-xs mx-auto md:mx-0">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-3xl font-bold text-white p-0 w-full"
                  placeholder="Set your name..."
                />
                <PencilIcon className="w-3 h-3 absolute -right-4 top-1/2 -translate-y-1/2 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="w-fit mx-auto md:mx-0 text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-widest font-bold">
                Level {level}
              </span>
            </div>
            <p className="text-slate-400 mb-6 flex items-center justify-center md:justify-start gap-2">
              <IdentificationIcon className="w-4 h-4" />
              Authenticated as: <span className="text-slate-200">{user?.email}</span>
            </p>
            <div className="space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Rank Progress</span>
                <span>{xp % 500} / 500 XP</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Control */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <KeyIcon className="w-8 h-8 text-indigo-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Account Control</h3>
            <p className="text-sm text-slate-400">Manage your secure workspace and device synchronization.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg">
              <CloudIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Sync Status</p>
              <p className="text-lg font-bold text-white">Cloud Active & Encrypted</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-red-600 text-white rounded-xl transition-all font-medium group"
          >
            <PowerIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Achievement Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-amber-400" />
          Milestones & Achievements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className={`p-6 rounded-2xl border transition-all ${ach.unlocked ? 'bg-slate-800/40 border-slate-700 shadow-lg' : 'bg-slate-900/20 border-slate-800/50 grayscale opacity-40'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${ach.bg}`}><ach.icon className={`w-6 h-6 ${ach.color}`} /></div>
                <div>
                  <h4 className="font-bold text-slate-100">{ach.title}</h4>
                  <p className="text-xs text-slate-500">{ach.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
