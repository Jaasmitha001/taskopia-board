
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Task } from "@/types/kanban";
import { formatDate, getDeadlineStatus } from "@/utils/dateUtils";
import { CalendarIcon, ClockIcon, MoreHorizontal, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, onDelete }, ref) => {
    const deadlineStatus = getDeadlineStatus(task.deadline);
    const navigate = useNavigate();

    const getPriorityColor = (priority: Task["priority"]) => {
      switch (priority) {
        case "High":
          return "priority-high";
        case "Medium":
          return "priority-medium";
        case "Low":
          return "priority-low";
        default:
          return "priority-low";
      }
    };

    const handleCardClick = (e: React.MouseEvent) => {
      // Prevent navigation if clicking on the menu
      if (e.target instanceof HTMLElement && 
          (e.target.closest('button') || e.target.closest('[role="menuitem"]'))) {
        return;
      }
      navigate(`/task/${task.id}`);
    };

    return (
      <Card
        ref={ref}
        className={`task-card animate-task-appear ${deadlineStatus} cursor-pointer`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2 pt-3 px-3 flex flex-row justify-between items-start">
          <div className="font-medium text-sm truncate">{task.title}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Task menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-3 py-1">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        </CardContent>
        <CardFooter className="px-3 pt-1 pb-2 flex flex-col gap-2 items-start">
          <div className="flex gap-2 w-full">
            <Badge
              variant="secondary"
              className={`${getPriorityColor(task.priority)} priority-badge`}
            >
              {task.priority}
            </Badge>
            <div className="flex-1"></div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(task.deadline)}
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{task.assignee.name}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
