
import { KanbanColumn as KanbanColumnType, Task } from '@/types/kanban';
import TaskCard from './TaskCard';
import { Badge } from './ui/badge';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask }: KanbanColumnProps) => {
  const getColumnStyle = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-kanban-todo border-t-4 border-kanban-todo-header';
      case 'In Progress':
        return 'bg-kanban-inprogress border-t-4 border-kanban-inprogress-header';
      case 'Review':
        return 'bg-kanban-review border-t-4 border-kanban-review-header';
      case 'Completed':
        return 'bg-kanban-completed border-t-4 border-kanban-completed-header';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`kanban-column ${getColumnStyle(column.title)}`}>
      <div className="column-header">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">{column.title}</h3>
          <Badge variant="secondary" className="ml-2 bg-background/80">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`kanban-column-content ${snapshot.isDraggingOver ? 'bg-primary/5' : ''} rounded transition-colors`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.9 : 1
                    }}
                  >
                    <TaskCard 
                      task={task} 
                      onEdit={onEditTask} 
                      onDelete={onDeleteTask} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
