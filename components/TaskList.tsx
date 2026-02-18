
import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskTitle.trim()) return;
    // Fix: Added missing 'category' property as required by Task type
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      category: 'elite'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl flex flex-col h-full shadow-xl backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
          Task Pool
          <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-400 font-mono">
            {tasks.length}
          </span>
        </h2>
        <p className="text-xs text-slate-400">Items ready to be scheduled into a sprint.</p>
      </div>

      <div className="p-4 border-b border-slate-700/50">
        <form onSubmit={addTask} className="flex gap-2">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task..."
            className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button 
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-[500px]">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">Your task pool is empty.<br/>Add some goals to begin.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                task.completed ? 'bg-slate-900/40 border-slate-800/50 opacity-60' : 'bg-slate-900 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-600 hover:text-slate-400'}`}
              >
                <CheckCircleIcon className="w-6 h-6" />
              </button>
              
              <span className={`flex-grow text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.title}
              </span>

              <button 
                onClick={() => removeTask(task.id)}
                className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700/50">
        <div className="bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20">
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">Pro Tip</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Assign tasks to your work blocks in the planner to keep focused on exactly one thing at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
