
import React, { useState } from 'react';
import { SprintBlock, BlockType } from '../types';
import { CheckCircleIcon, ClockIcon, ForwardIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CompletionDialogProps {
  onResponse: (finished: boolean, extraMinutes?: number) => void;
  currentBlock: SprintBlock | null;
  isOvertime: boolean;
}

const CompletionDialog: React.FC<CompletionDialogProps> = ({ onResponse, currentBlock, isOvertime }) => {
  const [customMinutes, setCustomMinutes] = useState('5');

  if (!currentBlock) return null;

  const overtimeOptions = [1, 3, 5, 10];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-20 blur-3xl ${
          currentBlock.type === BlockType.BREAK ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}></div>

        <div className="relative text-center">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
            currentBlock.type === BlockType.BREAK ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
          }`}>
            <ClockIcon className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Time's Up!
          </h2>
          <p className="text-slate-400 mb-8">
            You just finished {isOvertime ? 'an overtime session for' : ''} 
            <span className="text-white font-semibold"> "{currentBlock.label}"</span>. 
            How did it go?
          </p>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => onResponse(true)}
              className="group flex items-center justify-between p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <div className="text-left">
                <p className="font-bold text-lg">I'm finished</p>
                <p className="text-sm text-indigo-100/70">Continue to the next block</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">I need more time</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {overtimeOptions.map(min => (
                  <button 
                    key={min}
                    onClick={() => onResponse(false, min)}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-sm font-bold transition-all"
                  >
                    +{min}m
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Custom mins"
                />
                <button 
                  onClick={() => onResponse(false, parseInt(customMinutes))}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-bold transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            <button 
              onClick={() => onResponse(true)}
              className="flex items-center justify-center gap-2 p-3 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              <ForwardIcon className="w-4 h-4" />
              Skip current results and continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionDialog;
