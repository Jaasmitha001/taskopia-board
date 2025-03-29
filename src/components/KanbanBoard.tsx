
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { Status, Task } from '@/types/kanban';
import { useKanban } from '@/hooks/useKanban';
import TaskDialog from './TaskDialog';
import { Button } from './ui/button';
import { BoardFilters } from './BoardFilters';
import { ProgressSummary } from './ProgressSummary';
import { PlusCircle } from 'lucide-react';

const KanbanBoard = () => {
  const {
    data,
    progress,
    filters,
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
  } = useKanban();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside droppable area
    if (!destination) return;

    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move task
    moveTask(
      draggableId,
      source.droppableId as Status,
      destination.droppableId as Status,
      destination.index
    );
  };

  const clearFilters = () => {
    updateFilters({
      search: '',
      priority: 'All',
      assignee: 'All',
      status: 'All',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Project Board</h1>
        <Button onClick={openCreateTaskDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <ProgressSummary
        total={progress.total}
        completed={progress.completed}
        pending={progress.pending}
        percentage={progress.percentage}
      />

      <BoardFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
      />

      <div className="flex-1 overflow-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-h-[500px] pb-4 overflow-x-auto taskboard-scrollbar">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onEditTask={openEditTaskDialog}
                  onDeleteTask={deleteTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        mode={taskDialogMode}
        task={currentTask}
        onOpenChange={closeTaskDialog}
        onSave={addTask}
        onUpdate={updateTask}
      />
    </div>
  );
};

export default KanbanBoard;
