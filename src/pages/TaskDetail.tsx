
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Task, Priority, Status } from "@/types/kanban";
import { useKanban } from "@/hooks/useKanban";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Edit, 
  MessageSquare, 
  Trash2, 
  AlignLeft,
  User,
  Flag
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import TaskDialog from "@/components/TaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { getDeadlineStatus } from "@/utils/dateUtils";

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    originalData, 
    updateTask, 
    deleteTask,
    isTaskDialogOpen,
    taskDialogMode,
    currentTask,
    openEditTaskDialog,
    closeTaskDialog
  } = useKanban();
  
  const [task, setTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (taskId && originalData.tasks[taskId]) {
      setTask(originalData.tasks[taskId]);
    } else {
      navigate("/");
    }
  }, [taskId, originalData.tasks, navigate]);

  if (!task) {
    return <div className="min-h-screen flex items-center justify-center">Loading task...</div>;
  }

  const deadlineStatus = getDeadlineStatus(task.deadline);
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "bg-priority-high/20 text-red-800";
      case "Medium":
        return "bg-priority-medium/20 text-yellow-800";
      case "Low":
        return "bg-priority-low/20 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "To Do":
        return "bg-kanban-todo-header/20 text-purple-800";
      case "In Progress":
        return "bg-kanban-inprogress-header/20 text-blue-800";
      case "Review":
        return "bg-kanban-review-header/20 text-pink-800";
      case "Completed":
        return "bg-kanban-completed-header/20 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleDeleteConfirm = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
    navigate("/");
  };

  const deadline = new Date(task.deadline);
  const createdAt = new Date(task.createdAt);
  const isOverdue = deadline < new Date() && task.status !== "Completed";
  
  // Calculate days remaining or overdue
  const today = new Date();
  const differenceInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  // Determine progress status
  let progressValue = 0;
  switch (task.status) {
    case "To Do":
      progressValue = 0;
      break;
    case "In Progress":
      progressValue = 33;
      break;
    case "Review":
      progressValue = 66;
      break;
    case "Completed":
      progressValue = 100;
      break;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border-primary/10">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-medium truncate flex-1">
            Task Details
          </h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => openEditTaskDialog(task)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{task.title}</h2>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        <Flag className="mr-1 h-3 w-3" />
                        {task.priority} Priority
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Created {formatDistanceToNow(createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <AlignLeft className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                        <p className="text-foreground whitespace-pre-line">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Deadline</h3>
                        <div className={`text-foreground ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                          {format(deadline, 'PPPP')} 
                          {isOverdue ? (
                            <span className="text-destructive ml-2 font-medium">
                              ({Math.abs(differenceInDays)} days overdue)
                            </span>
                          ) : (
                            task.status !== "Completed" && (
                              <span className="text-muted-foreground ml-2">
                                ({differenceInDays > 0 ? `${differenceInDays} days remaining` : 'Due today'})
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h3>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-foreground font-medium">{task.assignee.name}</p>
                            <p className="text-xs text-muted-foreground">{task.assignee.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Task Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Status</span>
                      <span className="text-sm text-muted-foreground">{progressValue}%</span>
                    </div>
                    <Progress className="h-2" value={progressValue} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-background p-3 text-center">
                      <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                      <p className="mt-1 text-sm">{format(createdAt, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="rounded-lg bg-background p-3 text-center">
                      <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
                      <p className={`mt-1 text-sm ${isOverdue ? 'text-destructive font-medium' : ''}`}>
                        {format(deadline, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {task.status !== "Completed" && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            const updatedTask = {
                              ...task,
                              status: "Completed" as Status
                            };
                            updateTask(updatedTask);
                            setTask(updatedTask);
                          }}
                        >
                          <CheckSquare className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {task.status !== "In Progress" && task.status !== "Completed" && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            const updatedTask = {
                              ...task,
                              status: "In Progress" as Status
                            };
                            updateTask(updatedTask);
                            setTask(updatedTask);
                          }}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Start Task
                        </Button>
                      )}
                      
                      {task.status === "In Progress" && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            const updatedTask = {
                              ...task,
                              status: "Review" as Status
                            };
                            updateTask(updatedTask);
                            setTask(updatedTask);
                          }}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Request Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className={`inline-flex items-center justify-center p-2 rounded-full ${
                    deadlineStatus === 'overdue' 
                      ? 'bg-red-100 text-red-800' 
                      : deadlineStatus === 'approaching' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {deadlineStatus === 'overdue' ? (
                      <Clock className="h-6 w-6" />
                    ) : deadlineStatus === 'approaching' ? (
                      <Calendar className="h-6 w-6" />
                    ) : (
                      <CheckSquare className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="font-medium">
                    {deadlineStatus === 'overdue' 
                      ? 'Task is overdue!' 
                      : deadlineStatus === 'approaching' 
                        ? 'Deadline approaching' 
                        : 'On track'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {deadlineStatus === 'overdue' 
                      ? 'This task has passed its due date.' 
                      : deadlineStatus === 'approaching' 
                        ? 'This task is due soon.' 
                        : 'This task is on schedule.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Task Edit Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        mode={taskDialogMode}
        task={currentTask}
        onOpenChange={closeTaskDialog}
        onSave={() => {}}
        onUpdate={(updatedTask) => {
          updateTask(updatedTask);
          setTask(updatedTask);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              "{task.title}" and remove it from the board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskDetail;
