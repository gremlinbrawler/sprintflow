
import React from 'react';
import { CompletedSprint, BlockType } from '../types';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, TrashIcon, ArrowTrendingUpIcon, BoltIcon, HandRaisedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DashboardProps {
  history: CompletedSprint[];
  clearHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, clearHistory }) => {
  const totalWorkMinutes = history.reduce((acc, curr) => acc + curr.totalWorkMinutes, 0);
  const totalBreakMinutes = history.reduce((acc, curr) => acc + curr.totalBreakMinutes, 0);
  const totalWorkSaved = history.reduce((acc, curr) => acc + (curr.totalWorkTimeSaved || 0), 0);
  const totalOvertime = history.reduce((acc, curr) => acc + (curr.totalOvertimeMinutes || 0), 0);
  const totalTasksCompleted = history.reduce((acc, curr) => 
    acc + curr.tasksSnapshot.filter(t => t.completed).length, 0);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            Productivity Stats
            <ArrowTrendingUpIcon className="w-8 h-8 text-indigo-500" />
          </h2>
          <p className="text-slate-400">Tracking your progress and sprint flow.</p>
        </div>
        <button 
          onClick={() => { if(confirm('Clear history?')) clearHistory(); }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-slate-800 transition-all"
        >
          <TrashIcon className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Focus', value: `${totalWorkMinutes.toFixed(1)}m`, icon: ClockIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Work Saved', value: `${totalWorkSaved.toFixed(1)}m`, icon: BoltIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
          { label: 'Total Overtime', value: `${totalOvertime.toFixed(1)}m`, icon: ExclamationTriangleIcon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Tasks Done', value: totalTasksCompleted, icon: CheckCircleIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Break Time', value: `${totalBreakMinutes.toFixed(1)}m`, icon: HandRaisedIcon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
            <div className={`p-2.5 rounded-xl w-fit ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-white leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200">Recent Sprint Activity</h3>
          <span className="text-xs text-slate-500">{history.length} total entries</span>
        </div>
        
        <div className="divide-y divide-slate-800">
          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No sprints recorded yet. Start a session in the planner!
            </div>
          ) : (
            history.map((sprint) => (
              <div key={sprint.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-700 rounded-lg px-3 py-1 text-xs font-mono text-slate-300">
                        {formatDate(sprint.timestamp)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">{sprint.totalWorkMinutes}m Focus</span>
                        {sprint.totalOvertimeMinutes > 0 && (
                          <span className="text-xs text-rose-400 font-bold">(+{sprint.totalOvertimeMinutes}m OT)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {sprint.blocks.map((b, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          b.overtimeMinutes && b.overtimeMinutes > 0 ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : (b.type === BlockType.WORK ? 'bg-indigo-500' : 'bg-emerald-500')
                        }`}
                        style={{ width: `${Math.max(12, (b.duration + (b.overtimeMinutes || 0)) * 2.5)}px` }}
                        title={`${b.label} OT: ${b.overtimeMinutes || 0}m`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sprint.tasksSnapshot.filter(t => t.completed).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                  {sprint.totalOvertimeMinutes > 0 && (
                    <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
                      <ExclamationTriangleIcon className="w-4 h-4" />
                      Overtime Logged
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
