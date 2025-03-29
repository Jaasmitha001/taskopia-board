
export type Priority = 'Low' | 'Medium' | 'High';

export type Status = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string; // ISO date string
  assignee: User;
  createdAt: string; // ISO date string
};

export type KanbanColumn = {
  id: Status;
  title: Status;
  taskIds: string[];
};

export type KanbanData = {
  tasks: Record<string, Task>;
  columns: Record<string, KanbanColumn>;
  columnOrder: Status[];
};

export type FilterOptions = {
  search: string;
  priority: Priority | 'All';
  assignee: string | 'All';
  status: Status | 'All';
};

export type TaskDialogMode = 'create' | 'edit' | null;
