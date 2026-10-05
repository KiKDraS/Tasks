import { ROUTES } from "@/constants/routes";
import { Task } from "@/context/tasks/types/Task";
import { useTaskItem } from "@/hooks/tasks/use-task-item";
import { router } from "expo-router";
import { TaskBody } from "./task-body";
import { TaskCard } from "./task-card";
import { TaskHeader } from "./task-header";

interface HomeTaskProps {
  task: Task;
  now: Date;
}

export function HomeTask({ task, now }: Readonly<HomeTaskProps>) {
  const { isComplete, toggleCompletion, handleDelete } = useTaskItem(task);

  const handleEdit = () => {
    if (!task.id) {
      return;
    }
    router.push({ pathname: ROUTES.taskForm, params: { id: task.id } });
  };

  return (
    <TaskCard isComplete={isComplete}>
      <TaskHeader
        title={task.title}
        isComplete={isComplete}
        onToggle={toggleCompletion}
        onDelete={handleDelete}
        onEdit={handleEdit}
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
