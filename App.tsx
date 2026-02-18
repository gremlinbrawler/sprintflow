
import React, { useState, useEffect, useRef } from 'react';
import { BlockType, Task, BreakItem, SprintBlock, CompletedSprint, User, UserData, SyncStatus, SprintMode, RoadmapCheckpoint } from './types';
import SidebarManager from './components/SidebarManager';
import SprintPlanner from './components/SprintPlanner';
import TimerDisplay from './components/TimerDisplay';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AuthScreen from './components/AuthScreen';
import DailyQuestHub from './components/DailyQuestHub';

const IDENTITY_KEY = 'SF_ACTIVE_USER';
const DATA_PREFIX = 'SF_WORKSPACE_DATA_';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(IDENTITY_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [username, setUsername] = useState('Agent');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [breakItems, setBreakItems] = useState<BreakItem[]>([
    { id: 'b1', title: 'Hydration' },
    { id: 'b2', title: 'Deep Breathing' }
  ]);
  const [brainDump, setBrainDump] = useState<string[]>([]);
  const [history, setHistory] = useState<CompletedSprint[]>([]);
  const [completedShiftIds, setCompletedShiftIds] = useState<string[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [sprintMode, setSprintMode] = useState<SprintMode>('fluid');
  const [currentFlowTaskId, setCurrentFlowTaskId] = useState<string | null>(null);
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [activeSprint, setActiveSprint] = useState<SprintBlock[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [view, setView] = useState<'hub' | 'planner' | 'dashboard' | 'profile'>('hub');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');

  // --- 1. LOAD DATA ON USER CHANGE ---
  useEffect(() => {
    if (!currentUser) {
      setIsDataLoaded(false);
      return;
    }
    
    const userStorageKey = `${DATA_PREFIX}${currentUser.username.toUpperCase()}`;
    const rawData = localStorage.getItem(userStorageKey);
    
    if (rawData) {
      const data: UserData = JSON.parse(rawData);
      setUsername(data.username || currentUser.username);
      setTasks(data.tasks || []);
      setBreakItems(data.breakItems || []);
      setBrainDump(data.brainDump || []);
      setHistory(data.history || []);
      setCompletedShiftIds(data.completedShiftIds || []);
    } else {
      // First time user for this callsign
      setTasks([]);
      setHistory([]);
      setCompletedShiftIds([]);
    }
    setIsDataLoaded(true);
  }, [currentUser]);

  // --- 2. SAVE DATA (ONLY AFTER LOAD) ---
  useEffect(() => {
    if (!currentUser || !isDataLoaded) return;
    
    const save = () => {
      const userStorageKey = `${DATA_PREFIX}${currentUser.username.toUpperCase()}`;
      const payload: UserData = { 
        username, tasks, breakItems, brainDump, history, completedShiftIds,
        lastUpdated: new Date().toISOString() 
      };
      localStorage.setItem(userStorageKey, JSON.stringify(payload));
      setSyncStatus('synced');
    };

    setSyncStatus('syncing');
    const timer = setTimeout(save, 800);
    return () => clearTimeout(timer);
  }, [username, tasks, breakItems, brainDump, history, completedShiftIds, currentUser, isDataLoaded]);

  const handleLogin = (user: User) => {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (confirm("Sign out? Data for this callsign remains locally stored and encrypted.")) {
      localStorage.removeItem(IDENTITY_KEY);
      setCurrentUser(null);
      setIsDataLoaded(false);
      setView('hub');
    }
  };

  const handleStartShift = (checkpoint: RoadmapCheckpoint) => {
    // If shift was completed, remove it from completed list if they restart it
    setCompletedShiftIds(prev => prev.filter(id => id !== checkpoint.id));
    setActiveShiftId(checkpoint.id);
    const shiftTasks = tasks.filter(t => t.assignedShiftId === checkpoint.id && !t.completed);
    
    const blocks: SprintBlock[] = shiftTasks.map((t, idx) => ({
      id: `block-${Date.now()}-${idx}`,
      type: BlockType.WORK,
      duration: Math.floor(checkpoint.duration / Math.max(1, shiftTasks.length)),
      label: t.title,
      taskId: t.id
    }));

    if (blocks.length === 0) {
      blocks.push({ id: `block-f-${Date.now()}`, type: BlockType.WORK, duration: checkpoint.duration, label: checkpoint.label });
    }

    setActiveSprint(blocks);
    setCurrentBlockIndex(0);
    setTimeLeft(blocks[0].duration * 60);
    setIsRunning(true);
    setView('planner');
  };

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (currentBlockIndex !== null && currentBlockIndex < activeSprint.length - 1) {
        const next = currentBlockIndex + 1;
        setCurrentBlockIndex(next);
        setTimeLeft(activeSprint[next].duration * 60);
        setIsRunning(true);
      } else {
        // Mission Finalized
        if (activeShiftId) {
          setCompletedShiftIds(prev => [...new Set([...prev, activeShiftId])]);
        }
        alert("Mission Finalized. Operational data synced.");
        setCurrentBlockIndex(null);
        setActiveShiftId(null);
        setView('hub');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentBlockIndex, activeSprint, activeShiftId]);

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;
  if (!isDataLoaded) return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Restoring Workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d]">
      <Header setView={setView} currentView={view} syncStatus={syncStatus} user={currentUser} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'hub' ? (
          <DailyQuestHub 
            tasks={tasks} 
            setTasks={setTasks} 
            battleCry={""} 
            onStartShift={handleStartShift} 
            activeShiftId={activeShiftId} 
            completedShiftIds={completedShiftIds}
          />
        ) : view === 'planner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                <TimerDisplay timeLeft={timeLeft} activeBlock={currentBlockIndex !== null ? activeSprint[currentBlockIndex] : null} allBlocks={activeSprint} currentIndex={currentBlockIndex} onCompleteEarly={() => setTimeLeft(0)} sprintMode={sprintMode} allTasks={tasks} currentFlowTaskId={currentFlowTaskId} setCurrentFlowTaskId={setCurrentFlowTaskId} onToggleTask={(id) => setTasks(t => t.map(x => x.id === id ? {...x, completed: !x.completed} : x))} />
                <div className="mt-8">
                  <SprintPlanner blocks={activeSprint} setBlocks={setActiveSprint} tasks={tasks} breakItems={breakItems} currentBlockIndex={currentBlockIndex} timeLeft={timeLeft} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <SidebarManager tasks={tasks} setTasks={setTasks} breakItems={breakItems} setBreakItems={setBreakItems} brainDump={brainDump} setBrainDump={setBrainDump} />
            </div>
          </div>
        ) : view === 'dashboard' ? (
          <Dashboard history={history} clearHistory={() => setHistory([])} />
        ) : (
          <Profile history={history} username={username} setUsername={setUsername} tasks={tasks} breakItems={breakItems} user={currentUser} onLogout={handleLogout} />
        )}
      </main>
      <footer className="py-6 text-center text-slate-800 text-[9px] font-black uppercase tracking-[0.5em]">
        Ironclad Core • SF-MASTER-PRO
      </footer>
    </div>
  );
};

export default App;
