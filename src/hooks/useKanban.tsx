
import { useState, useCallback, useMemo } from 'react';
import initialData from '../data/mockData';
import { FilterOptions, KanbanData, Priority, Status, Task, TaskDialogMode, User } from '../types/kanban';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const useKanban = () => {
  const [data, setData] = useState<KanbanData>(initialData);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskDialogMode, setTaskDialogMode] = useState<TaskDialogMode>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priority: 'All',
    assignee: 'All',
    status: 'All'
  });

  // Task manipulation functions
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${uuidv4()}`,
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };

    setData(prev => {
      // Add the task to the tasks object
      const newTasks = {
        ...prev.tasks,
        [newTask.id]: newTask
      };

      // Add the task ID to the appropriate column
      const newColumns = {
        ...prev.columns,
        [newTask.status]: {
          ...prev.columns[newTask.status],
          taskIds: [...prev.columns[newTask.status].taskIds, newTask.id]
        }
      };

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns
      };
    });

    toast.success('Task created successfully');
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setData(prev => {
      // Check if the status changed
      const oldStatus = prev.tasks[updatedTask.id].status;
      const newStatus = updatedTask.status;
      
      // If status changed, we need to update the columns
      if (oldStatus !== newStatus) {
        // Remove task from old column
        const oldColumn = {
          ...prev.columns[oldStatus],
          taskIds: prev.columns[oldStatus].taskIds.filter(id => id !== updatedTask.id)
        };
        
        // Add task to new column
        const newColumn = {
          ...prev.columns[newStatus],
          taskIds: [...prev.columns[newStatus].taskIds, updatedTask.id]
        };
        
        // Update the tasks and columns
        return {
          ...prev,
          tasks: { ...prev.tasks, [updatedTask.id]: updatedTask },
          columns: { ...prev.columns, [oldStatus]: oldColumn, [newStatus]: newColumn }
        };
      }
      
      // If status didn't change, just update the task
      return {
        ...prev,
        tasks: { ...prev.tasks, [updatedTask.id]: updatedTask }
      };
    });

    toast.success('Task updated successfully');
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setData(prev => {
      const status = prev.tasks[taskId].status;
      
      // Create a new tasks object without the deleted task
      const { [taskId]: deletedTask, ...remainingTasks } = prev.tasks;
      
      // Remove the task ID from its column
      const newColumn = {
        ...prev.columns[status],
        taskIds: prev.columns[status].taskIds.filter(id => id !== taskId)
      };
      
      return {
        ...prev,
        tasks: remainingTasks,
        columns: { ...prev.columns, [status]: newColumn }
      };
    });

    toast.success('Task deleted successfully');
  }, []);

  // Drag and drop handling
  const moveTask = useCallback((taskId: string, sourceColumnId: Status, destinationColumnId: Status, newIndex: number) => {
    setData(prev => {
      // If moving within the same column
      if (sourceColumnId === destinationColumnId) {
        const column = prev.columns[sourceColumnId];
        const newTaskIds = Array.from(column.taskIds);
        
        // Remove task from its current position
        const sourceIndex = newTaskIds.indexOf(taskId);
        newTaskIds.splice(sourceIndex, 1);
        
        // Insert task at the new position
        newTaskIds.splice(newIndex, 0, taskId);
        
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...column,
              taskIds: newTaskIds
            }
          }
        };
      } else {
        // Moving between columns
        const sourceColumn = prev.columns[sourceColumnId];
        const destinationColumn = prev.columns[destinationColumnId];
        
        // Remove from source column
        const sourceTaskIds = Array.from(sourceColumn.taskIds);
        const sourceIndex = sourceTaskIds.indexOf(taskId);
        sourceTaskIds.splice(sourceIndex, 1);
        
        // Add to destination column
        const destinationTaskIds = Array.from(destinationColumn.taskIds);
        destinationTaskIds.splice(newIndex, 0, taskId);
        
        // Update the task's status
        const updatedTask = {
          ...prev.tasks[taskId],
          status: destinationColumnId
        };
        
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [taskId]: updatedTask
          },
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: sourceTaskIds
            },
            [destinationColumnId]: {
              ...destinationColumn,
              taskIds: destinationTaskIds
            }
          }
        };
      }
    });
  }, []);

  // Dialog handling
  const openCreateTaskDialog = useCallback(() => {
    setCurrentTask(null);
    setTaskDialogMode('create');
    setIsTaskDialogOpen(true);
  }, []);

  const openEditTaskDialog = useCallback((task: Task) => {
    setCurrentTask(task);
    setTaskDialogMode('edit');
    setIsTaskDialogOpen(true);
  }, []);

  const closeTaskDialog = useCallback(() => {
    setIsTaskDialogOpen(false);
    setTaskDialogMode(null);
    setCurrentTask(null);
  }, []);

  // Filter handling
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Progress calculations
  const progress = useMemo(() => {
    const totalTasks = Object.keys(data.tasks).length;
    const completedTasks = data.columns['Completed'].taskIds.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      percentage: progressPercentage
    };
  }, [data]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return Object.values(data.tasks).filter(task => {
      // Filter by search term
      const matchesSearch = filters.search ? 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        task.description.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      
      // Filter by priority
      const matchesPriority = filters.priority === 'All' ? true : task.priority === filters.priority;
      
      // Filter by assignee
      const matchesAssignee = filters.assignee === 'All' ? true : task.assignee.id === filters.assignee;
      
      // Filter by status
      const matchesStatus = filters.status === 'All' ? true : task.status === filters.status;
      
      return matchesSearch && matchesPriority && matchesAssignee && matchesStatus;
    });
  }, [data.tasks, filters]);

  // Filtered data structure for rendering
  const filteredData = useMemo(() => {
    const filteredTaskIds = filteredTasks.map(task => task.id);
    
    const newColumns = Object.entries(data.columns).reduce((acc, [columnId, column]) => {
      const newColumn = {
        ...column,
        taskIds: column.taskIds.filter(taskId => filteredTaskIds.includes(taskId))
      };
      
      return { ...acc, [columnId]: newColumn };
    }, {});
    
    return {
      ...data,
      columns: newColumns
    };
  }, [data, filteredTasks]);

  return {
    data: filteredData,
    originalData: data,
    filters,
    progress,
    isTaskDialogOpen,
    taskDialogMode,
    currentTask,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    updateFilters,
    openCreateTaskDialog,
    openEditTaskDialog,
    closeTaskDialog,
  };
};
