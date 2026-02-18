
import React, { useMemo, useState } from 'react';
import { BlockType, SprintBlock, Task, SprintMode, SubTask } from '../types';
import { CheckIcon, PlayIcon, ListBulletIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface TimerDisplayProps {
  timeLeft: number;
  activeBlock: SprintBlock | null;
  allBlocks: SprintBlock[];
  currentIndex: number | null;
  onCompleteEarly: () => void;
  isOvertime?: boolean;
  sprintMode: SprintMode;
  allTasks: Task[];
  currentFlowTaskId: string | null;
  setCurrentFlowTaskId: (id: string | null) => void;
  onToggleTask: (id: string) => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  timeLeft, activeBlock, allBlocks, currentIndex, onCompleteEarly, isOvertime, 
  sprintMode, allTasks, currentFlowTaskId, setCurrentFlowTaskId, onToggleTask
}) => {
  const [showPicker, setShowPicker] = useState(false);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const blockProgress = activeBlock ? ((activeBlock.duration * 60 - timeLeft) / (activeBlock.duration * 60)) * 100 : 0;
  
  const totalProgress = useMemo(() => {
    if (allBlocks.length === 0 || currentIndex === null) return 0;
    const totalDurationSecs = allBlocks.reduce((acc, curr) => acc + curr.duration * 60, 0);
    let elapsedSecs = 0;
    for (let i = 0; i < currentIndex; i++) elapsedSecs += allBlocks[i].duration * 60;
    if (activeBlock) elapsedSecs += (activeBlock.duration * 60 - timeLeft);
    return (elapsedSecs / totalDurationSecs) * 100;
  }, [allBlocks, currentIndex, activeBlock, timeLeft]);

  const activeFlowTask = allTasks.find(t => t.id === currentFlowTaskId);

  const getStructuredDisplay = () => {
    if (!activeBlock || activeBlock.type === BlockType.BREAK) return activeBlock?.label || 'Rest Period';
    
    const task = allTasks.find(t => t.id === activeBlock.taskId);
    if (!task) return activeBlock.label || 'Deep Work';

    if (activeBlock.subTaskId) {
      const sub = task.subTasks?.find(s => s.id === activeBlock.subTaskId);
      return `${task.title} > ${sub?.title || 'Sub-step'}`;
    }

    return task.title;
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-3xl p-8 border shadow-2xl transition-all duration-500 ${
      isOvertime ? 'border-rose-500/50 shadow-rose-500/10' : 'border-slate-700/50'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-80 h-80 -mr-40 -mt-40 rounded-full opacity-10 blur-3xl transition-colors duration-1000 ${
        isOvertime ? 'bg-rose-500 animate-pulse' : (activeBlock?.type === BlockType.BREAK ? 'bg-emerald-500' : 'bg-indigo-500')
      }`}></div>

      <div className="relative z-10 flex flex-col items-center">
        {currentIndex !== null && (
          <div className="w-full mb-8">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Total Sprint Flow</span>
                <span className="text-[10px] font-mono text-slate-500">{Math.round(totalProgress)}%</span>
             </div>
             <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-1000"
                  style={{ width: `${totalProgress}%` }}
                ></div>
             </div>
          </div>
        )}

        {/* Status Badges */}
        <div className="flex gap-2 mb-6">
          {isOvertime && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-bounce shadow-lg shadow-rose-500/20 uppercase tracking-widest">
              Overtime
            </span>
          )}
          <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-700 uppercase tracking-widest">
            {sprintMode === 'fluid' ? 'Fluid Flow Mode' : 'Structured Mode'}
          </span>
        </div>

        {/* Main Focus Content */}
        <div className="w-full max-w-lg mx-auto mb-6 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/30">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            {activeBlock?.type === BlockType.BREAK ? 'Rest Interval' : 'Current Focus'}
          </p>
          
          {activeBlock?.type === BlockType.BREAK ? (
            <h3 className="text-2xl font-bold text-emerald-400">{activeBlock.label}</h3>
          ) : (
            <div className="flex flex-col items-center">
              {sprintMode === 'structured' ? (
                <h3 className="text-2xl font-bold text-white text-center">
                  {getStructuredDisplay()}
                </h3>
              ) : (
                <div className="w-full">
                  {!activeFlowTask ? (
                    <button 
                      onClick={() => setShowPicker(!showPicker)}
                      className="w-full py-4 border-2 border-dashed border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <ListBulletIcon className="w-5 h-5" />
                      Pick a Task to Begin
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-grow text-left">
                        <h3 className="text-xl font-bold text-white leading-tight">{activeFlowTask.title}</h3>
                        {activeFlowTask.subTasks && activeFlowTask.subTasks.length > 0 && (
                          <p className="text-xs text-indigo-400 mt-1">
                            {activeFlowTask.subTasks.filter(s => s.completed).length}/{activeFlowTask.subTasks.length} Steps Done
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { onToggleTask(activeFlowTask.id); setCurrentFlowTaskId(null); }}
                          className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setShowPicker(true)}
                          className="p-2 bg-slate-700 text-slate-300 rounded-lg"
                        >
                          <ArrowRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Picker Modal (Simple) */}
        {showPicker && sprintMode === 'fluid' && (
          <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white">Select Focus Task</h4>
              <button onClick={() => setShowPicker(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-2">
              {allTasks.filter(t => !t.completed).map(task => (
                <button 
                  key={task.id}
                  onClick={() => { setCurrentFlowTaskId(task.id); setShowPicker(false); }}
                  className="w-full text-left p-4 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all text-sm font-medium"
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-8 mb-4">
          <div className={`mono text-8xl md:text-9xl font-black tracking-tighter transition-colors ${
            isOvertime ? 'text-rose-500' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          {activeBlock && (
            <button 
              onClick={onCompleteEarly}
              title="Finish this block early"
              className={`group flex flex-col items-center justify-center w-20 h-20 border rounded-3xl transition-all ${
                isOvertime ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20' : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20'
              }`}
            >
              <CheckIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] mt-1 font-black uppercase tracking-widest">Next</p>
            </button>
          )}
        </div>

        <div className="w-full max-w-md">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${
                isOvertime 
                  ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' 
                  : (activeBlock?.type === BlockType.BREAK ? 'bg-emerald-500' : 'bg-indigo-500')
              }`}
              style={{ width: `${blockProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-3 px-1">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
               {isOvertime ? 'OVERTIME CLOCK' : 'CURRENT INTERVAL'}
             </span>
             <span className="text-[10px] text-slate-400 font-mono">{Math.round(blockProgress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
