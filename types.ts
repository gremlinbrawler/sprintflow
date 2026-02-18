
export enum BlockType {
  WORK = 'WORK',
  BREAK = 'BREAK'
}

export type SprintMode = 'structured' | 'fluid';
export type TaskCategory = 'frog' | 'elite' | 'swarm';
export type ShiftStatus = 'pending' | 'active' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignedShiftId?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: TaskCategory;
  subTasks?: SubTask[];
  assignedShiftId?: string;
}

export interface BreakItem {
  id: string;
  title: string;
}

export interface SprintBlock {
  id: string;
  type: BlockType;
  duration: number; 
  actualDuration?: number; 
  overtimeMinutes?: number; 
  label: string;
  taskId?: string; 
  subTaskId?: string;
  breakItemId?: string; 
}

export interface CompletedSprint {
  id: string;
  timestamp: number;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  totalWorkTimeSaved: number; 
  totalBreakTimeSaved: number; 
  totalOvertimeMinutes: number;
  blocks: SprintBlock[];
  tasksSnapshot: Task[]; 
  breakItemsSnapshot: BreakItem[];
  mode: SprintMode;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
}

export interface UserData {
  tasks: Task[];
  breakItems: BreakItem[];
  brainDump?: string[];
  history: CompletedSprint[];
  username: string;
  lastUpdated: string;
  completedShiftIds?: string[]; // Tracks finished missions for the hub
}

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

export interface RoadmapCheckpoint {
  id: string;
  label: string;
  threshold: number; 
  description: string;
  icon: string;
  status: ShiftStatus;
  duration: number;
}
