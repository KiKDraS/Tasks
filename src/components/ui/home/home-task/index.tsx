import { Task } from "@/context/tasks/types/Task";
import { useTaskActions } from "@/hooks/tasks/use-task-actions";
import { TaskBody } from "./task-body";
import { TaskCard } from "./task-card";
import { TaskHeader } from "./task-header";

interface HomeTaskProps {
  task: Task;
  now: Date;
}

export function HomeTask({ task, now }: Readonly<HomeTaskProps>) {
  const { toggleCompletion, handleDelete, openEdit } = useTaskActions(task);
  const isComplete = !!task.isComplete;

  return (
    <TaskCard isComplete={isComplete}>
      <TaskHeader
        title={task.title}
        isComplete={isComplete}
        onToggle={toggleCompletion}
        onDelete={handleDelete}
        onEdit={openEdit}
      />
      <TaskBody task={task} isComplete={isComplete} now={now} />
    </TaskCard>
  );
}
