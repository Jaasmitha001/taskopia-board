
import { KanbanData, Status, User } from '../types/kanban';
import { addDays, subDays, format } from 'date-fns';

// Mock users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    role: 'Frontend Developer'
  },
  {
    id: 'user-2',
    name: 'Alice Smith',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=5D8B3D&color=fff',
    role: 'Backend Developer'
  },
  {
    id: 'user-3',
    name: 'Emma Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=8B3D5D&color=fff',
    role: 'UI/UX Designer'
  },
  {
    id: 'user-4',
    name: 'Michael Brown',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=3D5D8B&color=fff',
    role: 'Project Manager'
  },
  {
    id: 'user-5',
    name: 'Sophia Martinez',
    avatar: 'https://ui-avatars.com/api/?name=Sophia+Martinez&background=8B3D8B&color=fff',
    role: 'QA Engineer'
  }
];

// Generate dates for tasks
const today = new Date();
const tomorrow = addDays(today, 1);
const nextWeek = addDays(today, 7);
const yesterday = subDays(today, 1);
const lastWeek = subDays(today, 7);

// Mock task data
const initialData: KanbanData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Implement Landing Page',
      description: 'Create a responsive landing page with the new design mockups',
      status: 'To Do',
      priority: 'High',
      deadline: format(tomorrow, 'yyyy-MM-dd'),
      assignee: users[0],
      createdAt: format(today, 'yyyy-MM-dd'),
    },
    'task-2': {
      id: 'task-2',
      title: 'API Integration for User Authentication',
      description: 'Connect frontend login forms with the new authentication API',
      status: 'In Progress',
      priority: 'High',
      deadline: format(tomorrow, 'yyyy-MM-dd'),
      assignee: users[1],
      createdAt: format(subDays(today, 2), 'yyyy-MM-dd'),
    },
    'task-3': {
      id: 'task-3',
      title: 'Design User Profile Page',
      description: 'Create UI mockups for the user profile section',
      status: 'Completed',
      priority: 'Medium',
      deadline: format(lastWeek, 'yyyy-MM-dd'),
      assignee: users[2],
      createdAt: format(subDays(today, 10), 'yyyy-MM-dd'),
    },
    'task-4': {
      id: 'task-4',
      title: 'Bug Fix: Payment Processing',
      description: 'Fix the issue with payment processing on checkout',
      status: 'Review',
      priority: 'High',
      deadline: format(yesterday, 'yyyy-MM-dd'),
      assignee: users[1],
      createdAt: format(subDays(today, 3), 'yyyy-MM-dd'),
    },
    'task-5': {
      id: 'task-5',
      title: 'Create Documentation',
      description: 'Write documentation for the API endpoints',
      status: 'To Do',
      priority: 'Low',
      deadline: format(nextWeek, 'yyyy-MM-dd'),
      assignee: users[3],
      createdAt: format(subDays(today, 1), 'yyyy-MM-dd'),
    },
    'task-6': {
      id: 'task-6',
      title: 'Implement Dark Mode',
      description: 'Add dark mode support to the application',
      status: 'In Progress',
      priority: 'Medium',
      deadline: format(addDays(today, 3), 'yyyy-MM-dd'),
      assignee: users[0],
      createdAt: format(subDays(today, 4), 'yyyy-MM-dd'),
    },
    'task-7': {
      id: 'task-7',
      title: 'Performance Optimization',
      description: 'Optimize application loading speed and performance',
      status: 'To Do',
      priority: 'Medium',
      deadline: format(addDays(today, 5), 'yyyy-MM-dd'),
      assignee: users[4],
      createdAt: format(subDays(today, 2), 'yyyy-MM-dd'),
    },
    'task-8': {
      id: 'task-8',
      title: 'User Testing Session',
      description: 'Conduct user testing for the new features',
      status: 'Completed',
      priority: 'High',
      deadline: format(yesterday, 'yyyy-MM-dd'),
      assignee: users[2],
      createdAt: format(subDays(today, 7), 'yyyy-MM-dd'),
    },
    'task-9': {
      id: 'task-9',
      title: 'Database Schema Migration',
      description: 'Implement the new database schema and migrate existing data',
      status: 'Review',
      priority: 'High',
      deadline: format(today, 'yyyy-MM-dd'),
      assignee: users[1],
      createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
    },
    'task-10': {
      id: 'task-10',
      title: 'Email Template Design',
      description: 'Design responsive email templates for notifications',
      status: 'Completed',
      priority: 'Low',
      deadline: format(subDays(today, 3), 'yyyy-MM-dd'),
      assignee: users[2],
      createdAt: format(subDays(today, 8), 'yyyy-MM-dd'),
    },
    'task-11': {
      id: 'task-11',
      title: 'Update Dependencies',
      description: 'Update all npm packages to their latest versions',
      status: 'To Do',
      priority: 'Low',
      deadline: format(addDays(today, 14), 'yyyy-MM-dd'),
      assignee: users[0],
      createdAt: format(today, 'yyyy-MM-dd'),
    },
    'task-12': {
      id: 'task-12',
      title: 'Implement Notification System',
      description: 'Create a real-time notification system for users',
      status: 'In Progress',
      priority: 'Medium',
      deadline: format(addDays(today, 6), 'yyyy-MM-dd'),
      assignee: users[3],
      createdAt: format(subDays(today, 3), 'yyyy-MM-dd'),
    },
  },
  columns: {
    'To Do': {
      id: 'To Do',
      title: 'To Do',
      taskIds: ['task-1', 'task-5', 'task-7', 'task-11'],
    },
    'In Progress': {
      id: 'In Progress',
      title: 'In Progress',
      taskIds: ['task-2', 'task-6', 'task-12'],
    },
    'Review': {
      id: 'Review',
      title: 'Review',
      taskIds: ['task-4', 'task-9'],
    },
    'Completed': {
      id: 'Completed',
      title: 'Completed',
      taskIds: ['task-3', 'task-8', 'task-10'],
    },
  },
  columnOrder: ['To Do', 'In Progress', 'Review', 'Completed'],
};

export default initialData;
