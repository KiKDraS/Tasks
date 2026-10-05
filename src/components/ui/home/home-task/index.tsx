import { Task } from "@/context/tasks/types/Task";
import { useTaskItem } from "@/hooks/tasks/use-task-item";
import { TaskBody } from "./task-body";
import { TaskCard } from "./task-card";
import { TaskHeader } from "./task-header";

interface HomeTaskProps {
  task: Task;
  now: Date;
}

export function HomeTask({ task, now }: Readonly<HomeTaskProps>) {
  const { isComplete, toggleCompletion, handleDelete, openEdit } =
    useTaskItem(task);

  return (
    <TaskCard isComplete={isComplete}>
      <TaskHeader
        title={task.title}
        isComplete={isComplete}
        onToggle={toggleCompletion}
        onDelete={handleDelete}
        onEdit={openEdit}
      />
      <TaskBody
        description={task.description}
        isComplete={isComplete}
        notification={task.notification}
        now={now}
      />
    </TaskCard>
  );
}
