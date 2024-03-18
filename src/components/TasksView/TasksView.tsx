import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";
import Button from "../Button/Button";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import "./TaskView.css";
import {
  defaultTasks,
} from "../utils/utils";
import { Task, logs } from "../types";
import { useTaskManager } from "../hooks/useTaskManager";

interface TaskViewProps {
  sessionId: string;
  setLogs: React.Dispatch<React.SetStateAction<logs[]>>;
}

const TaskView = ({ setLogs, sessionId }: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [progress, setProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const getTaskNameFromId = (id: number | null): string => {
    const task = tasks.find((task) => task.id === id);
    return task?.name ? task.name : "No dependencies";
  };

  const { updateTasks, runSelectedTask } = useTaskManager({ setTasks, setProgress, sessionId, tasks, setLogs });


  const runAllTasks = async () => {
    setProgress(true);
    for (let i = 0; i < tasks.length; i++) {
      await runSelectedTask(tasks[i]);
    }
    setProgress(false);
  }


  return (
    <div className="task-view">
      <div>
        <h2> Current tasks </h2>
      </div>
      {tasks.map((task) => (
        <TaskItem
          task={task}
          key={task.id}
          getTaskNameFromId={getTaskNameFromId}
          runSelectedTask={() => runSelectedTask(task)}
        />
      ))}
      <div className="button-group">
        <div className="create-task">
          <Button
            name="Create task"
            onClick={() => setIsModalOpen(true)}
            disabled={progress}
          />
        </div>
        <div className="create-task">
          <Button name="Run all tasks" disabled={progress} onClick={() => runAllTasks()}/>
        </div>
      </div>
      {isModalOpen && (
        <NewTaskModal
          tasks={tasks}
          closeModal={closeModal}
          updateTasks={updateTasks}
        />
      )}
    </div>
  );
};

export default TaskView;