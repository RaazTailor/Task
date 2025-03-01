import { type Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const levelColors = {
  N1: "bg-green-100 text-green-800",
  N2: "bg-blue-100 text-blue-800",
  N3: "bg-yellow-100 text-yellow-800",
  N4: "bg-orange-100 text-orange-800",
  N5: "bg-purple-100 text-purple-800",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleMutation.mutate()}
              disabled={toggleMutation.isPending}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-medium truncate",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    levelColors[task.category]
                  )}
                >
                  {task.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  Due {format(new Date(task.date), "PP")}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteMutation.mutate()}
              className="text-destructive hover:text-destructive/80"
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}