
import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon, SparklesIcon, FireIcon, HandRaisedIcon, RocketLaunchIcon, BugAntIcon, BoltIcon, ChevronDownIcon, ChevronUpIcon, BeakerIcon, ExclamationTriangleIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { Task, BreakItem, SubTask, TaskCategory } from '../types';

interface SidebarManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  breakItems: BreakItem[];
  setBreakItems: React.Dispatch<React.SetStateAction<BreakItem[]>>;
  brainDump: string[];
  setBrainDump: React.Dispatch<React.SetStateAction<string[]>>;
}

const SidebarManager: React.FC<SidebarManagerProps> = ({ tasks, setTasks, breakItems, setBreakItems, brainDump, setBrainDump }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'breaks' | 'dump'>('tasks');
  const [newInput, setNewInput] = useState('');

  const handleAddItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newInput.trim()) return;
    
    if (activeTab === 'tasks') {
      setTasks([...tasks, { id: `task-${Date.now()}`, title: newInput, completed: false, priority: 'medium', category: 'elite', subTasks: [] }]);
    } else if (activeTab === 'breaks') {
      setBreakItems([...breakItems, { id: `break-${Date.now()}`, title: newInput }]);
    } else {
      setBrainDump([newInput, ...brainDump]);
    }
    setNewInput('');
  };

  const removeItem = (id: string) => {
    if (activeTab === 'tasks') setTasks(tasks.filter(x => x.id !== id));
    else setBreakItems(breakItems.filter(x => x.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col h-full shadow-2xl overflow-hidden backdrop-blur-xl min-h-[600px]">
      {/* Tab Switcher */}
      <div className="flex p-2 m-4 bg-slate-950 rounded-2xl border border-slate-800/50">
        {['tasks', 'breaks', 'dump'].map((tab: any) => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === tab 
                ? (tab === 'dump' ? 'bg-rose-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {tab === 'dump' ? 'Intrusion Log' : tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Input Zone */}
      <div className="px-8 pb-4">
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input 
            type="text" value={newInput} onChange={(e) => setNewInput(e.target.value)}
            placeholder={activeTab === 'dump' ? "Dump a distraction..." : activeTab === 'breaks' ? "New recovery tactic..." : "New goal..."}
            className={`flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-700 outline-none transition-all font-bold ${
              activeTab === 'dump' ? 'focus:border-rose-500' : 'focus:border-indigo-500'
            }`}
          />
          <button 
            type="submit" 
            className={`p-3 text-white rounded-2xl shadow-lg transition-all ${
              activeTab === 'dump' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Content List */}
      <div className="flex-grow overflow-y-auto px-8 py-4 space-y-4 custom-scrollbar">
        {activeTab === 'dump' ? (
          brainDump.length === 0 ? (
            <div className="text-center py-20 opacity-20 flex flex-col items-center">
              <CpuChipIcon className="w-12 h-12 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Mental RAM is Clear</p>
            </div>
          ) : (
            brainDump.map((item, i) => (
              <div key={i} className="group p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-right-2">
                <span className="text-xs text-rose-200 italic font-mono leading-relaxed">>> {item}</span>
                <button 
                  onClick={() => setBrainDump(brainDump.filter((_, idx) => idx !== i))} 
                  className="text-rose-900 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          )
        ) : activeTab === 'tasks' ? (
          tasks.length === 0 ? (
            <div className="text-center py-20 opacity-20">
              <p className="text-[10px] font-black uppercase tracking-widest">Reservoir Empty</p>
            </div>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <span className={`text-sm font-bold ${t.completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>{t.title}</span>
                <button onClick={() => removeItem(t.id)} className="text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 transition-all"><TrashIcon className="w-4 h-4" /></button>
              </div>
            ))
          )
        ) : (
          breakItems.map(b => (
             <div key={b.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                <span className="text-sm font-bold text-emerald-400">{b.title}</span>
                <button onClick={() => removeItem(b.id)} className="text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 transition-all"><TrashIcon className="w-4 h-4" /></button>
             </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-8 bg-slate-950/50 border-t border-slate-800">
        {activeTab === 'dump' && brainDump.length > 0 && (
          <button 
            onClick={() => { if(confirm("Flush mental RAM? All intrusions will be cleared.")) setBrainDump([]); }} 
            className="w-full py-3 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-rose-500 border border-rose-500/30 rounded-xl hover:bg-rose-500/10 transition-all"
          >
            Flush Intrusion Log
          </button>
        )}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Tactical Guide</p>
           <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
             {activeTab === 'dump' ? "Clear your mental buffer instantly. Record distractions here to return to deep focus immediately." : "Manage your tactical targets and recovery strategies here."}
           </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarManager;
