
import React from 'react';
// Fix: Added missing ChevronUpIcon and ChevronDownIcon imports
import { PlusIcon, TrashIcon, ArrowsUpDownIcon, ListBulletIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { BlockType, SprintBlock, Task, BreakItem } from '../types';

interface SprintPlannerProps {
  blocks: SprintBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<SprintBlock[]>>;
  tasks: Task[];
  breakItems: BreakItem[];
  currentBlockIndex: number | null;
  timeLeft: number;
}

const SprintPlanner: React.FC<SprintPlannerProps> = ({ blocks, setBlocks, tasks, breakItems, currentBlockIndex, timeLeft }) => {
  const addBlock = (type: BlockType) => {
    const newBlock: SprintBlock = {
      id: `block-${Date.now()}`,
      type,
      duration: type === BlockType.WORK ? 25 : 5,
      label: type === BlockType.WORK ? 'Focus Deployment' : 'Rest Cycle',
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<SprintBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleTaskChange = (blockId: string, value: string) => {
    if (!value) {
      updateBlock(blockId, { taskId: undefined, subTaskId: undefined });
      return;
    }
    
    if (value.startsWith('sub:')) {
      const ids = value.replace('sub:', '').split('|');
      updateBlock(blockId, { taskId: ids[0], subTaskId: ids[1] });
    } else {
      updateBlock(blockId, { taskId: value, subTaskId: undefined });
    }
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const isCurrent = currentBlockIndex === index;
        const isDone = currentBlockIndex !== null && index < currentBlockIndex;
        
        let blockProgress = 0;
        if (isDone) blockProgress = 100;
        else if (isCurrent) {
          blockProgress = ((block.duration * 60 - timeLeft) / (block.duration * 60)) * 100;
        }

        const currentValue = block.subTaskId ? `sub:${block.taskId}|${block.subTaskId}` : (block.taskId || '');

        return (
          <div 
            key={block.id} 
            className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-500 ${
              isCurrent 
                ? 'bg-indigo-500/10 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] z-10' 
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            } ${isDone ? 'opacity-40 grayscale-[0.5]' : ''}`}
          >
            {isCurrent && (
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.8)]"></div>
            )}

            <div className="flex items-center gap-4 w-full">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-[10px] tracking-widest border ${
                block.type === BlockType.WORK ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {block.type === BlockType.WORK ? 'FCS' : 'RST'}
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4">
                  <input 
                    type="text"
                    value={block.label}
                    onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-100 placeholder-slate-700"
                    placeholder="Operation Name..."
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input 
                    type="number"
                    value={block.duration}
                    onChange={(e) => updateBlock(block.id, { duration: Math.max(1, Number(e.target.value)) })}
                    className="w-14 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-center text-xs font-black text-indigo-400 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-[10px] font-black text-slate-600 uppercase">MIN</span>
                </div>

                <div className="md:col-span-6">
                  {block.type === BlockType.WORK ? (
                     <select 
                      value={currentValue} 
                      onChange={(e) => handleTaskChange(block.id, e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="">Select Tactical Target</option>
                      {tasks.map(t => (
                        <React.Fragment key={t.id}>
                          <option value={t.id}>{t.title} (Complete Task)</option>
                          {t.subTasks?.map(st => (
                            <option key={`${t.id}-${st.id}`} value={`sub:${t.id}|${st.id}`}>
                               ↳ TADPOLE: {st.title}
                            </option>
                          ))}
                        </React.Fragment>
                      ))}
                    </select>
                  ) : (
                    <select 
                      value={block.breakItemId || ''} 
                      onChange={(e) => updateBlock(block.id, { breakItemId: e.target.value || undefined })}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none"
                    >
                      <option value="">Recovery Activity</option>
                      {breakItems.map(b => (
                        <option key={b.id} value={b.id}>{b.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-1">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveBlock(index, 'up')} className="p-1 text-slate-600 hover:text-indigo-400 transition-colors bg-slate-900 rounded-md">
                    <ChevronUpIcon className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveBlock(index, 'down')} className="p-1 text-slate-600 hover:text-indigo-400 transition-colors bg-slate-900 rounded-md">
                    <ChevronDownIcon className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="ml-2 p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Block Progress Strip */}
            {currentBlockIndex !== null && (isCurrent || isDone) && (
              <div className="mt-3 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    block.type === BlockType.WORK ? 'bg-indigo-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${blockProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => addBlock(BlockType.WORK)}
          className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all text-xs font-black uppercase tracking-widest"
        >
          <PlusIcon className="w-4 h-4" /> Add Focus Block
        </button>
        <button 
          onClick={() => addBlock(BlockType.BREAK)}
          className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-xs font-black uppercase tracking-widest"
        >
          <PlusIcon className="w-4 h-4" /> Add Break Cycle
        </button>
      </div>
    </div>
  );
};

export default SprintPlanner;