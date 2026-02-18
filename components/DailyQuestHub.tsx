
import React, { useMemo, useState, useEffect } from 'react';
import { Task, RoadmapCheckpoint } from '../types';
import { RocketLaunchIcon, CheckCircleIcon, BoltIcon, ArrowRightIcon, FlagIcon, SunIcon, TrophyIcon, StarIcon, FireIcon, PlusIcon, ListBulletIcon, BookmarkSquareIcon } from '@heroicons/react/24/outline';
import { getMilestoneEncouragement } from '../services/geminiService';

interface DailyQuestHubProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  battleCry: string;
  onStartShift: (checkpoint: RoadmapCheckpoint) => void;
  activeShiftId: string | null;
  completedShiftIds: string[];
}

const INITIAL_CHECKPOINTS: RoadmapCheckpoint[] = [
  { id: 'dawn', label: 'Dawn Breaker', threshold: 0, description: 'Quick momentum wins.', icon: 'SunIcon', status: 'pending', duration: 45 },
  { id: 'peak', label: 'The High Peak', threshold: 25, description: 'Deep focus projects.', icon: 'FlagIcon', status: 'pending', duration: 90 },
  { id: 'surge', label: 'Afternoon Surge', threshold: 60, description: 'High energy output.', icon: 'FireIcon', status: 'pending', duration: 60 },
  { id: 'victory', label: 'Victory Lap', threshold: 85, description: 'Final admin & cleanup.', icon: 'TrophyIcon', status: 'pending', duration: 30 }
];

const DailyQuestHub: React.FC<DailyQuestHubProps> = ({ tasks, setTasks, battleCry, onStartShift, activeShiftId, completedShiftIds }) => {
  const [milestoneMsg, setMilestoneMsg] = useState('');
  const [quickAddValues, setQuickAddValues] = useState<Record<string, string>>({});

  const globalProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return (completed / tasks.length) * 100;
  }, [tasks]);

  useEffect(() => {
    if (globalProgress > 0) {
      const stage = globalProgress < 30 ? 'Dawn' : globalProgress < 70 ? 'Midday' : 'Finish';
      getMilestoneEncouragement(globalProgress, stage).then(setMilestoneMsg);
    }
  }, [globalProgress]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const assignTask = (id: string, shift: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, assignedShiftId: t.assignedShiftId === shift ? undefined : shift };
      }
      return t;
    }));
  };

  const handleQuickAdd = (shiftId: string) => {
    const val = quickAddValues[shiftId];
    if (!val?.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: val.trim(),
      completed: false,
      priority: 'medium',
      category: 'elite',
      assignedShiftId: shiftId
    };
    setTasks(prev => [...prev, newTask]);
    setQuickAddValues(prev => ({ ...prev, [shiftId]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full -mr-40 -mt-40"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-600/20">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Command Hub</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1">Operational Workspace</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-300 italic mb-10 max-w-2xl leading-relaxed">
            "{battleCry || "Workspace active. Plan your missions by staging objectives into the timeline below."}"
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Overall Completion</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-white italic min-w-[70px]">{Math.round(globalProgress)}%</span>
                <div className="flex-grow h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
                   <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${globalProgress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Tactical Advisory</p>
              <p className="text-sm font-bold text-slate-200 italic leading-snug">
                {tasks.length === 0 ? "Resource pool empty. Add mission objectives to start." : `"${milestoneMsg || "Analyzing performance metrics..."}"`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {INITIAL_CHECKPOINTS.map(cp => {
          const stagedTasks = tasks.filter(t => t.assignedShiftId === cp.id && !t.completed);
          const isShiftDone = completedShiftIds.includes(cp.id);
          const isActive = activeShiftId === cp.id;

          return (
            <div 
              key={cp.id} 
              className={`relative flex flex-col p-6 rounded-[2.5rem] border transition-all duration-500 min-h-[420px] ${
                isShiftDone ? 'bg-emerald-950/40 border-emerald-500/30 opacity-70' :
                isActive ? 'bg-indigo-600 border-indigo-400 shadow-xl scale-105 z-20' : 
                'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl ${
                  isShiftDone ? 'bg-emerald-500/20 text-emerald-400' :
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isShiftDone ? <CheckCircleIcon className="w-6 h-6" /> : (
                    <>
                      {cp.id === 'dawn' && <SunIcon className="w-6 h-6" />}
                      {cp.id === 'peak' && <FlagIcon className="w-6 h-6" />}
                      {cp.id === 'surge' && <FireIcon className="w-6 h-6" />}
                      {cp.id === 'victory' && <TrophyIcon className="w-6 h-6" />}
                    </>
                  )}
                </div>
                <div className="text-right">
                  <h4 className={`text-sm font-black uppercase tracking-widest leading-none ${isActive ? 'text-white' : isShiftDone ? 'text-emerald-400' : 'text-slate-300'}`}>{cp.label}</h4>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isShiftDone ? 'MISSION COMPLETE' : `${cp.duration} MIN`}</span>
                </div>
              </div>

              <div className="flex-grow space-y-2 mb-6 overflow-y-auto custom-scrollbar pr-1 max-h-[160px]">
                {stagedTasks.length === 0 && !isShiftDone && (
                  <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-800/50 rounded-3xl opacity-30">
                    <ListBulletIcon className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">No Objectives</span>
                  </div>
                )}
                {isShiftDone && (
                  <div className="flex flex-col items-center justify-center py-10">
                     <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-2">
                       <CheckCircleIcon className="w-8 h-8" />
                     </div>
                     <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Targets Cleared</span>
                  </div>
                )}
                {!isShiftDone && stagedTasks.map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                    isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <span className="truncate pr-2">{task.title}</span>
                    <button onClick={() => assignTask(task.id, cp.id)} className="text-slate-600 hover:text-rose-500">✕</button>
                  </div>
                ))}
              </div>

              {!isShiftDone && (
                <div className="mb-6 relative">
                  <input 
                    type="text" 
                    value={quickAddValues[cp.id] || ''}
                    onChange={(e) => setQuickAddValues({ ...quickAddValues, [cp.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd(cp.id)}
                    placeholder="Quick stage..."
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold outline-none border transition-all ${
                      isActive ? 'bg-white/10 border-white/20 text-white placeholder-white/40' : 'bg-slate-950 border-slate-800 text-white placeholder-slate-700 focus:border-indigo-500'
                    }`}
                  />
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <button 
                  onClick={() => onStartShift(cp)}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all shadow-xl font-black uppercase text-[10px] tracking-widest active:scale-95 ${
                    isShiftDone ? 'bg-emerald-600 text-slate-950 hover:bg-emerald-500' :
                    isActive ? 'bg-white text-indigo-600' : 
                    stagedTasks.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
                  }`}
                >
                  {isShiftDone ? 'Restart Mission' : stagedTasks.length > 0 ? (isActive ? 'Resume' : 'Deploy') : 'Quick Focus'}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <h3 className="font-black text-white uppercase text-xs tracking-[0.4em] flex items-center gap-3">
              <BoltIcon className="w-6 h-6 text-indigo-400" />
              Target Reservoir
            </h3>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{tasks.filter(t => !t.completed).length} Items</span>
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {tasks.filter(t => !t.completed).map(task => (
               <div key={task.id} className={`group flex flex-col p-5 bg-slate-900 border rounded-3xl transition-all ${
                 task.assignedShiftId ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/5' : 'border-slate-800 hover:border-slate-700'
               }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleTask(task.id)} className="text-slate-700 hover:text-indigo-400 transition-colors">
                        <CheckCircleIcon className="w-7 h-7" />
                      </button>
                      <div>
                        <span className="font-bold text-slate-200">{task.title}</span>
                        {task.assignedShiftId && (
                           <div className="flex items-center gap-1.5 mt-1">
                              <BookmarkSquareIcon className="w-3 h-3 text-indigo-400" />
                              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Locked: {INITIAL_CHECKPOINTS.find(c => c.id === task.assignedShiftId)?.label}</span>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {INITIAL_CHECKPOINTS.map(cp => (
                      <button 
                        key={cp.id} onClick={() => assignTask(task.id, cp.id)} 
                        className={`p-3 rounded-xl border transition-all ${
                          task.assignedShiftId === cp.id ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                      >
                         {cp.id === 'dawn' && <SunIcon className="w-4 h-4" />}
                         {cp.id === 'peak' && <FlagIcon className="w-4 h-4" />}
                         {cp.id === 'surge' && <FireIcon className="w-4 h-4" />}
                         {cp.id === 'victory' && <TrophyIcon className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
               </div>
             ))}
          </div>
        </div>
        <div className="space-y-6">
           <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <h3 className="font-black text-white uppercase text-xs tracking-[0.4em] flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
              Intelligence Logs
            </h3>
          </div>
          <div className="space-y-3">
             {tasks.filter(t => t.completed).slice(0, 5).map(task => (
               <div key={task.id} className="flex items-center justify-between p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem] opacity-70">
                 <div className="flex items-center gap-4 text-slate-400">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                    <span className="line-through font-bold text-sm">{task.title}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestHub;
