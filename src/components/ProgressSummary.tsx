
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, CircleDashed, ClipboardList } from "lucide-react";

interface ProgressSummaryProps {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

export function ProgressSummary({ total, completed, pending, percentage }: ProgressSummaryProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
              <p className="text-lg font-semibold">{total}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <CircleDashed className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-lg font-semibold">{pending}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-lg font-semibold">{completed}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
